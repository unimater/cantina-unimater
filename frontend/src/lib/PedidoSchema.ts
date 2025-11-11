import { z } from 'zod'

export const pedidoSchema = z.object({
  descricao: z
    .string()
    .min(1, 'A descrição é obrigatória.')
    .max(150, 'A descrição deve ter no máximo 150 caracteres.'),

  total: z
    .union([
      z.string().transform(val => {
        const num = Number(val)
        if (isNaN(num)) throw new Error('O valor total deve ser um número válido.')
        return num
      }),
      z.number().min(0, 'O valor total deve ser maior ou igual a zero.'),
    ])
    .refine(val => val >= 0, {
      message: 'O valor total não pode ser negativo.',
    }),

  categoria: z.enum(['PRODUTO', 'DESPESA'], {
    required_error: 'A categoria é obrigatória.',
    invalid_type_error: 'Categoria inválida.',
  }),

  situacao: z.boolean().default(true),
})
