import { z } from 'zod'

export const pedidoSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(150, 'Descrição deve ter no máximo 150 caracteres'),

  total: z.coerce
    .number()
    .min(0, 'O valor total deve ser maior ou igual a zero'),

  situacao: z.boolean().default(true),

  categoria: z.enum(['PRODUTO', 'DESPESA'], {
    message: 'Categoria é obrigatória',
  }),
})
