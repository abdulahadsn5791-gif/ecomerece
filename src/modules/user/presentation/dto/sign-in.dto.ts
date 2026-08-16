import { z } from 'zod';

export const SignInDtoSchema = z.object({
    name: z.object({
        firstName: z.string(),
        fullName: z.string(),
        required: z.unknown().optional(),
        middleName: z.string().nullable().optional(),
        lastName: z.string().nullable().optional(),
    }),
    email: z.email(),
    image: z.url(),
});

export type SignInDto = z.infer<typeof SignInDtoSchema>;
