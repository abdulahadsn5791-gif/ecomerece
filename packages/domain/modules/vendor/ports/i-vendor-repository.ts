import type { Id } from '../../../../core/domain/value-objects/id.vo';
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
}
