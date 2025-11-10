import { z } from 'zod';

export const pedidoSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(150, 'Descrição deve ter no máximo 150 caracteres'),
  valorTotal: z
    .number()
    .min(0, 'Valor total não pode ser negativo'),
  situacao: z.boolean().default(true),
  categoria: z.enum(['PRODUTO', 'DESPESA'], {
    message: 'Categoria é obrigatória',
  }),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});
