import { z } from 'zod';

export const produtoSchema = z
  .object({
    nome: z
      .string()
      .min(1, 'Descrição é obrigatório')
      .max(300, 'Descrição deve ter no máximo 300 caracteres'),
    situacao: z.boolean(),
    categoriaId: z.string(),
    valor: z.number().min(0)
  })
