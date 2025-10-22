import z from 'zod';

export const ForgotPasswordDto = z.object({
  email: z.string().email(),
});

export type ForgotPasswordBodySchema = z.infer<typeof ForgotPasswordDto>;