import { z } from 'zod';

export const DeleteMyVendorDtoSchema = z.object({
    reason: z.string().trim().min(10).max(1000),
});

export type DeleteMyVendorDto = z.infer<typeof DeleteMyVendorDtoSchema>;

export const DeleteVendorDtoSchema = z.object({
    vendorId: z.uuidv7(),
    reason: z.string().trim().min(10).max(1000),
});

export type DeleteVendorDto = z.infer<typeof DeleteVendorDtoSchema>;
