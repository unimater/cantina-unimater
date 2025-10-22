import z from "zod";

export const despesaSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(100, 'Máximo de 100 caracteres'),
  fornecedor: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(100, 'Máximo de 100 caracteres'),
  observacao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(100, 'Máximo de 100 caracteres'),
  data: z
    .string()
    .refine(value => {
      const data = new Date(value);
      const hoje = new Date();
      return data <= hoje;
    }, 'Não é permitido registrar uma data futura.'),
  valor: z.number,
});

export type FormValues = z.infer<typeof despesaSchema>;