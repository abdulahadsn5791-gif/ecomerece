import { z } from 'zod';

export const VerifyVendorDtoSchema = z.object({
    vendorId: z.uuidv7(),
});

export type VerifyVendorDto = z.infer<typeof VerifyVendorDtoSchema>;
