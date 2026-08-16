import { z } from 'zod';

export const RejectVendorDtoSchema = z.object({
    vendorId: z.uuidv7(),
    reason: z.string().trim().min(10).max(1000),
});

export type RejectVendorDto = z.infer<typeof RejectVendorDtoSchema>;
