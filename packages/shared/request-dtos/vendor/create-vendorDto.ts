import { z } from 'zod';

export const CreateVendorDtoSchema = z.object({
    title: z.string().trim().min(3).max(100),
    description: z.string().trim().min(10).max(1000),

    slug: z
        .string()
        .trim()
        .min(3)
        .max(100)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug'),

    contacts: z.object({
        phone: z.string(),
        email: z.email(),
        address: z.object({
            streetAddress: z.string().min(1),
            city: z.string().min(1),
            state: z.string().min(1),
            postalCode: z.string().min(1),
            country: z.string().min(1),
        }),
    }),

    image: z.object({
        logo: z.url(),
        banner: z.url(),
    }),
});

export type CreateVendorDto = z.infer<typeof CreateVendorDtoSchema>;
