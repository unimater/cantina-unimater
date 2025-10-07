import { z } from "zod";

export const usuarioSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(150, "Nome deve ter no máximo 150 caracteres"),
  situacao: z.boolean().default(true),
  email: z
    .string()
    .email("Email inválido")
    .max(150)
    .optional()
    .or(z.literal("")),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone deve estar no formato (XX) XXXXX-XXXX")
    .max(15)
    .optional()
    .or(z.literal("")),
  usuario: z
    .string()
    .min(1, "Usuário é obrigatório")
    .max(20, "Usuário deve ter no máximo 20 caracteres"),
  senha: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial"),
  confirmarSenha: z.string(),
})
.refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem. Verifique e tente novamente.",
  path: ["confirmarSenha"],
});