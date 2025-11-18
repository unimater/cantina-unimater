import { z } from 'zod';

export const VerifyResetTokenDto = z.object({
  email: z.string().email(),
  codigo: z.string().min(1),
});

export type VerifyResetTokenDtoType = z.infer<typeof VerifyResetTokenDto>;
