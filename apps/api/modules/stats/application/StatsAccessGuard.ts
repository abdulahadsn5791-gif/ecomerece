import { ForbiddenError, NotFoundError } from '../../../errors/app-error';
import { ProductModel } from '../../product/infrastructure/product.model';
import { VendorModel } from '../../vendor/infrastructure/vendor.models';

/**
 * Owner/admin guard for revenue-sensitive stats reads, implemented with direct
 * Mongo lookups (no query bus), per the stats module's read-path convention.
 *
 * - Admin: always allowed.
 * - Vendor owner: can read stats for its own vendor entity and any product it sells.
 * - Any other entity type stays open (public page/category awareness).
 */
export class StatsAccessGuard {
  async ensureProductReadable(
    productId: string,
    role: string | undefined,
    userId: string,
  ): Promise<void> {
    if (role === 'admin') return;

    const product = await ProductModel.findById(productId).select('vendorId').lean();
    if (!product) throw new NotFoundError('Product not found.');

    const vendor = await VendorModel.findOne({ ownerId: userId }).select('_id').lean();
    if (!vendor || String(product.vendorId) !== String(vendor._id)) {
      throw new ForbiddenError('You can only view stats for your own products.');
    }
  }

  async ensureEntityReadable(
    entityType: string,
    entityId: string,
    role: string | undefined,
    userId: string,
  ): Promise<void> {
    if (role === 'admin') return;
    if (entityType === 'product') return this.ensureProductReadable(entityId, role, userId);

    if (entityType === 'vendor') {
      const vendor = await VendorModel.findOne({ ownerId: userId }).select('_id').lean();
      if (!vendor || String(entityId) !== String(vendor._id)) {
        throw new ForbiddenError('You can only view stats for your own vendor.');
      }
    }
  }
}

export const statsAccessGuard = new StatsAccessGuard();
