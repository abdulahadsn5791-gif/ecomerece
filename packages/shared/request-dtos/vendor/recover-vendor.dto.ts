import { z } from 'zod';

export const RecoverVendorDtoSchema = z.object({
    vendorId: z.uuidv7(),
});

export type RecoverVendorDto = z.infer<typeof RecoverVendorDtoSchema>;
