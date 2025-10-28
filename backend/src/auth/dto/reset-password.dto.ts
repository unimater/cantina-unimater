import { z } from 'zod';

export const ResetPasswordDto = z.object({
  email: z.string().email(),
  codigo: z.string().min(1),
  novaSenha: z.string().min(6),
});

export type ResetPasswordDtoType = z.infer<typeof ResetPasswordDto>;
