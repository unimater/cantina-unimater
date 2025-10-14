import { z } from 'zod';

export const categoriaSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(150, 'Descrição deve ter no máximo 150 caracteres'),
  tipo: z.enum(['PRODUTO', 'DESPESA'], {
    message: 'Tipo é obrigatório',
  }),
  situacao: z.boolean().default(true),
});
