import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { <label htmlFor=""></label> } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";import { useState } from "react";
import { Usuario } from "@/type/Usuario";
import { toast } from "@/components/ui/sonner";

type FormValues = z.infer<typeof usuarioSchema>;

interface CriarUsuarioProps {
  onUsuarioCriado: (usuario: Usuario) => void;
  usuariosExistentes: Usuario[];
}

const CriarUsuario: React.FC<CriarUsuarioProps> = ({ onUsuarioCriado, usuariosExistentes }) => {
  const [open, setOpen] = useState(false);
  const [temAlteracao, setTemAlteracao] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(UsuarioSchema),
    defaultValues: { situacao: true },
  });

  const campos = form.watch();

  // Detecta alterações (exceto situação)
  useState(() => {
    const { situacao, ...outros } = campos;
    const tem = Object.values(outros).some((v) => v);
    setTemAlteracao(tem);
  });

  const onSubmit = (data: FormValues) => {
    const nomeNormalizado = (str: string) =>
      str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const nomeDuplicado = usuariosExistentes.some(
      (u) => nomeNormalizado(u.nome) === nomeNormalizado(data.nome)
    );

    if (nomeDuplicado) {
      toast.error("Não foi possível salvar o registro!", {
        description: "Já existe um usuário com a mesma descrição. Verifique!",
      });
      return;
    }

    const loginDuplicado = usuariosExistentes.some((u) => u.usuario === data.usuario);
    if (loginDuplicado) {
      toast.error("Não foi possível salvar o registro!", {
        description: "O nome de usuário já está em uso por outro usuário. Verifique!",
      });
      return;
    }

    const novoUsuario: Usuario = {
      id: Date.now(),
      nome: data.nome,
      situacao: data.situacao,
      email: data.email || undefined,
      telefone: data.telefone || undefined,
      usuario: data.usuario,
      senha: data.senha,
    };

    onUsuarioCriado(novoUsuario);
    toast.success("Sucesso!", {
      description: "O usuário foi incluído com sucesso.",
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && temAlteracao) {
          if (confirm("Você possui alterações não salvas. Deseja realmente sair?")) {
            setOpen(false);
            form.reset();
          }
        } else {
          setOpen(isOpen);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Novo Usuário</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Usuário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Card: Identificação */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-lg">Identificação</h3>
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <FormLabel>Situação</FormLabel>
                <FormField
                  control={form.control}
                  name="situacao"
                  render={({ field }) => (
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  )}
                />
              </div>
            </div>

            {/* Card: Contato */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-lg">Contato</h3>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="exemplo@faculdade.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 91234-5678" maxLength={15} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Card: Acesso */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-lg">Acesso</h3>
              <FormField
                control={form.control}
                name="usuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário *</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: ana.silva" maxLength={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmarSenha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmação de Senha *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Repita a senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CriarUsuario;