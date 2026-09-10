import { z } from 'zod';

export const VendorParamDtoSchema = z.uuidv7({ message: 'Must be a valid vendor ID' });

export type VendorParamDto = z.infer<typeof VendorParamDtoSchema>;
