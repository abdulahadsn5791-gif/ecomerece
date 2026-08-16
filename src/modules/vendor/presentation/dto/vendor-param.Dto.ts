import { z } from 'zod';

export const VendorParamDtoSchema = z.uuidv7();

export type VendorParamDto = z.infer<typeof VendorParamDtoSchema>;
