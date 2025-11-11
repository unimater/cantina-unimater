import { z } from 'zod';

export const usuarioSchemaBase = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(150),
  situacao: z.boolean().default(true),
  email: z.string().email('Email inválido').max(150).optional().or(z.literal('')),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/)
    .optional()
    .or(z.literal('')),
  usuario: z.string().min(1, 'Usuário é obrigatório').max(20),
  cpf: z
    .string().min(1,'CPF é obrigatório').max(14),
});

export const usuarioSchemaCriar = usuarioSchemaBase
  .extend({
    senha: z
      .string()
      .min(8, 'Senha deve ter no mínimo 8 caracteres')
      .regex(/[a-z]/)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    confirmarSenha: z.string(),
  })
  .refine(data => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  });

export const usuarioSchemaEditar = usuarioSchemaBase.extend({
  senha: z.string().optional().or(z.literal('')),
  confirmarSenha: z.string().optional().or(z.literal('')),
});
