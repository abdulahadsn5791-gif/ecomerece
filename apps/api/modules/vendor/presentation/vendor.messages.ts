import type { Id } from '@ecomerece/domain/value-objects/id.vo';

export type VendorMessagesType = { message: string };
export const VendorMessages = {
  createdVendor(vendorId: Id, actorId: Id): VendorMessagesType {
    return {
      message: `Vendor ${vendorId.value} was created successfully by ${actorId.value}.`,
    };
  },
  deletedVendor(vendorId: Id, actorId: Id): VendorMessagesType {
    return {
      message: `Vendor ${vendorId.value} was deleted successfully by ${actorId.value}.`,
    };
  },
  verifiedVendor(vendorId: Id, actorId: Id): VendorMessagesType {
    return {
      message: `Vendor ${vendorId.value} was verified successfully by ${actorId.value}.`,
    };
  },
  rejectVendorVerification(vendorId: Id, actorId: Id): VendorMessagesType {
    return {
      message: `The verification for vendor ${vendorId.value} was rejected by ${actorId.value}.`,
    };
  },
  recoveredVendor(vendorId: Id, actorId: Id): VendorMessagesType {
    return {
      message: `Vendor ${vendorId.value} was recovered successfully by ${actorId.value}.`,
    };
  },
};
