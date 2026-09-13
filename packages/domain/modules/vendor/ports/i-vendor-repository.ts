import type { Metrics } from '@ecomerece/shared';
import type { Id, Quantity } from '../../../value-objects';
import type { VendorAggregate } from '../vendor.aggregate';

export interface IVendorRepository {
  FindById(id: Id): Promise<VendorAggregate | null>;
  FindByIdOrThrow(id: Id): Promise<VendorAggregate>;
  FindByOwnerId(id: Id): Promise<VendorAggregate | null>;
  FindByIds(ids: Id[]): Promise<VendorAggregate[]>;
  FindByOwnerIdOrThrow(id: Id): Promise<VendorAggregate>;
  EnsureOwnershipOrThrow(vendorId: Id, userId: Id): Promise<VendorAggregate>;
  Create(user: VendorAggregate): Promise<void>;
  Save(user: VendorAggregate): Promise<void>;
  Delete(id: Id): Promise<void>;
  Exists(id: Id): Promise<boolean>;
  /** Denormalized lifetime stats for a single vendor (embedded `Vendor.stats`). */
  getStatsById(id: Id): Promise<Metrics | null>;
  /** Denormalized lifetime stats for many vendors, keyed by vendor id. */
  getStatsByIds(ids: Id[]): Promise<Map<string, Metrics>>;
  FindPaginated(params: { cursor?: Id; limit?: Quantity; direction?: 'next' | 'prev' }): Promise<{
    data: any;
    meta: {
      nextCursor: string | null;
      prevCursor: string | null;
      hasMore: boolean;
    };
  }>;
}
