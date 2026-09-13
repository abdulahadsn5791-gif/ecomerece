import type { IEvent, IEventHandler } from '@ecomerece/domain';
import { connectDB } from '../../../../lib/mongo';
import { VendorModel } from '../../../vendor/infrastructure/vendor.models';
import { vendorStatsRefreshService } from '../vendor-stats-refresh.service';

export interface VendorStatsDenormalizationDeps {
  connectDB: () => Promise<unknown>;
  loadVendors: () => Promise<{ id: string }[]>;
  refreshVendorCore: (vendorId: string) => Promise<void>;
}

/**
 * Denormalized vendor stats (auto-sync). Rolls every non-deleted vendor's product
 * stats up into vendor-level stats — embedded `Vendor.stats` (lifetime) plus
 * lifetime/daily/weekly/monthly slots in the raw Stats collection. Runs on the
 * same `stats.product-denormalization-requested` event as the product and
 * category roll-ups, so the scheduler tick and the admin "Run data correction"
 * action refresh vendor stats too. Uses idempotent `$set` writes — re-runs never
 * double count. Every vendor is refreshed on every run (legacy `statsRefreshEnabled`
 * opt-out is ignored) so dashboards never go stale over long idle windows.
 *
 * Category roll-up is intentionally not duplicated here — the global category
 * handler already covers all categories on the same event. The vendor
 * force-refresh path (its own event) does include categories for its vendor.
 */
export class VendorStatsDenormalizationHandler implements IEventHandler<{ force: boolean }> {
  private readonly deps: VendorStatsDenormalizationDeps;

  constructor(deps: Partial<VendorStatsDenormalizationDeps> = {}) {
    this.deps = { ...VendorStatsDenormalizationHandler.defaultDeps(), ...deps };
  }

  private static defaultDeps(): VendorStatsDenormalizationDeps {
    return {
      connectDB,
      loadVendors: async () => {
        const docs = await VendorModel.find({ 'deleted.deleted': false }).select('_id').lean();
        return docs.map((d) => ({ id: String(d._id) }));
      },
      refreshVendorCore: (vendorId) => vendorStatsRefreshService.refreshVendorCore(vendorId),
    };
  }

  async handle(event: IEvent<{ force: boolean }>): Promise<void> {
    // Force vs auto doesn't change scope for vendor stats — vendors are always
    // all refreshed so the stale-data backstop stays effective.
    void event.payload.force;

    await this.deps.connectDB();

    const vendors = await this.deps.loadVendors();
    for (const vendor of vendors) {
      await this.deps.refreshVendorCore(vendor.id);
    }
  }
}
