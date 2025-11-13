import { z } from 'zod'

// 🔹 Validação dos itens do pedido
export const pedidoItemSchema = z.object({
  produtoId: z.string().min(1, 'O produto é obrigatório.'),
  quantidade: z
    .number()
    .min(1, 'A quantidade deve ser pelo menos 1.')
    .max(9999, 'Quantidade muito alta.'),
  precoUnitario: z
    .number()
    .min(0, 'Preço unitário inválido.'),
  subtotal: z
    .number()
    .min(0, 'Subtotal inválido.'),
})

// 🔹 Validação do pedido
export const pedidoSchema = z.object({
  descricao: z
    .string()
    .min(1, 'A descrição é obrigatória.')
    .max(150, 'Máximo 150 caracteres.'),

  total: z
    .union([
      z.string().transform(val => {
        const num = Number(val)
        if (isNaN(num)) throw new Error('O valor total deve ser um número válido.')
        return num
      }),
      z.number(),
    ])
    .refine(val => val >= 0, { message: 'Total não pode ser negativo.' }),

  categoria: z.enum(['PRODUTO', 'DESPESA'], {
    required_error: 'A categoria é obrigatória.',
  }),

  situacao: z.boolean().default(true),

  status: z.enum(['FINALIZADO', 'CANCELADO']).optional(),

  formaPagamentoId: z.string().optional(),

  itens: z
    .array(pedidoItemSchema)
    .min(1, 'Adicione pelo menos 1 item ao pedido.'),
})
