import type { Id } from '../../../core/domain/value-objects/id.vo';

export type VendorMessagesType = { message: string };
export const VendorMessages = {
    createdVendor(vendorId: Id, actorId: Id): VendorMessagesType {
        return {
            message: `Vendor id:${vendorId.value} created successfully by requestor:${actorId.value}`,
        };
    },
    deletedVendor(vendorId: Id, actorId: Id): VendorMessagesType {
        return {
            message: `Vendor id:${vendorId.value} deleted successfully by requestor:${actorId.value}`,
        };
    },

    verifiedVendor(vendorId: Id, actorId: Id): VendorMessagesType {
        return {
            message: `Vendor id:${vendorId.value} has been verified successfully by requestor:${actorId.value}`,
        };
    },
    rejectVendorVerification(vendorId: Id, actorId: Id): VendorMessagesType {
        return {
            message: `Vendor id:${vendorId.value} verification has been rejected successfully by requestor:${actorId.value}`,
        };
    },
    recoveredVendor(vendorId: Id, actorId: Id): VendorMessagesType {
        return {
            message: `Vendor id:${vendorId.value}  has been recovered successfully by requestor:${actorId.value}`,
        };
    },
};
