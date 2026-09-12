import type { IEvent, IEventHandler } from '@ecomerece/domain';
import { emptyMetrics, type Metrics } from '@ecomerece/shared';
import { ProductModel } from '../../../product/infrastructure/product.model';
import { VendorModel } from '../../../vendor/infrastructure/vendor.models';
import { statsRepository } from '../../infrastructure/StatsRepository';

/**
 * Event-driven denormalization of lifetime metrics onto product documents so the
 * product read path (listings, top-products) never joins against the raw stats
 * collection. Vendors are processed one-by-one to spread load, and vendors that
 * opted out of auto-refresh are skipped unless the admin forced a correction.
 */
export class ProductStatsDenormalizationHandler implements IEventHandler<{ force: boolean }> {
  async handle(event: IEvent<{ force: boolean }>): Promise<void> {
    const { force } = event.payload;

    const vendors = await VendorModel.find({ 'deleted.deleted': false })
      .select('_id statsRefreshEnabled')
      .lean();

    for (const vendor of vendors) {
      if (!force && vendor.statsRefreshEnabled === false) continue;

      const products = await ProductModel.find({
        vendorId: vendor._id,
        'deleted.deleted': false,
      })
        .select('_id')
        .lean();

      if (products.length === 0) continue;

      const productIds = products.map((p) => String(p._id));
      const lifetimeDocs = await statsRepository.getLifetimeDocs('product', productIds);
      const statsByProduct = new Map<string, Metrics>(
        lifetimeDocs.map((doc) => [
          doc.entity?.id ?? '',
          { ...emptyMetrics(), ...((doc.metrics ?? {}) as Partial<Metrics>) },
        ]),
      );

      await ProductModel.bulkWrite(
        productIds.map((id) => ({
          updateOne: {
            filter: { _id: id },
            update: { $set: { stats: statsByProduct.get(id) ?? emptyMetrics() } },
          },
        })),
        { ordered: false },
      );
    }
  }
}
