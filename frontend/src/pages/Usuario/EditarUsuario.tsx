import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { usuarioSchemaEditar } from '@/lib/UsuarioSchema';
import type { Usuario } from '@/type/Usuario';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';

type FormValues = z.infer<typeof usuarioSchemaEditar>;

interface EditarUsuarioProps {
  usuario: Usuario;
  onUsuarioAtualizado: (usuario: Usuario) => void;
  usuariosExistentes: Usuario[];
}

const EditarUsuario: React.FC<EditarUsuarioProps> = ({
  usuario,
  onUsuarioAtualizado,
  usuariosExistentes,
}) => {
  const [open, setOpen] = useState(false);
  const [temAlteracao, setTemAlteracao] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (usuarioAtualizado: Usuario) => {
      const response = await api.patch(
        `http://localhost:3000/users/${usuario.id}`,
        usuarioAtualizado
      );
      return response.data;
    },
    onSuccess: usuarioAtualizadoDoBackend => {
      queryClient.invalidateQueries({ queryKey: ['getUsuarios'] });
      onUsuarioAtualizado(usuarioAtualizadoDoBackend);
      toast.success('Sucesso!', {
        description: 'O usuário foi atualizado com sucesso.',
      });
      form.reset();
      setOpen(false);
    },
    onError: (error: { response: { data: { message: string } } }) => {
      const message = error.response?.data?.message || 'Não foi possível atualizar o usuário.';
      toast.error('Erro!', {
        description: message,
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(usuarioSchemaEditar),
    defaultValues: {
      nome: usuario.name || '',
      cpf: usuario.cpf || '',
      situacao: usuario.active ?? true,
      email: usuario.email || '',
      telefone: usuario.phone || '',
      usuario: usuario.username || '',
      senha: '',
      confirmarSenha: '',
    },
  });

  const campos = form.watch();

  useEffect(() => {
    const { ...outros } = campos;
    const tem = Object.values(outros).some(v => v);
    setTemAlteracao(tem);
  }, [campos]);

  useEffect(() => {
  if (usuario) {
    form.reset({
      nome: usuario.name || '',
      cpf: usuario.cpf || '',
      situacao: usuario.active ?? true,
      email: usuario.email || '',
      telefone: usuario.phone || '',
      usuario: usuario.username || '',
      senha: '',
      confirmarSenha: '',
    });
  }
}, [usuario, form]);

  const onSubmit = (data: FormValues) => {
    const nomeNormalizado = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const nomeDuplicado = usuariosExistentes
      .filter(u => u.id !== usuario.id)
      .some(u => nomeNormalizado(u.name) === nomeNormalizado(data.nome));

    if (nomeDuplicado) {
      toast.error('Não foi possível salvar o registro!', {
        description: 'Já existe um usuário com a mesma descrição. Verifique!',
      });
      return;
    }

    const loginDuplicado = usuariosExistentes
      .filter(u => u.id !== usuario.id)
      .some(u => u.username === data.usuario);

    if (loginDuplicado) {
      toast.error('Não foi possível salvar o registro!', {
        description: 'O nome de usuário já está em uso por outro usuário. Verifique!',
      });
      return;
    }

    const usuarioAtualizado: Usuario = {
      ...usuario,
      name: data.nome,
      cpf: data.cpf,
      active: data.situacao,
      email: data.email || undefined,
      phone: data.telefone || undefined,
      username: data.usuario,
      password: data.senha || usuario.password,
    };

    updateMutation.mutate(usuarioAtualizado);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen && temAlteracao) {
          if (confirm('Você possui alterações não salvas. Deseja realmente sair?')) {
            setOpen(false);
            form.reset();
          }
        } else {
          setOpen(isOpen);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
        >
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-screen max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-2'
          >
            <div className='space-y-4 rounded-lg border p-4'>
              <h3 className='text-lg font-semibold'>Identificação</h3>
              <p className='text-muted-foreground text-sm'>ID: {usuario.id}</p>
              <FormField
                control={form.control}
                name='nome'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='cpf'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='000.000.000-00'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex items-center gap-2'>
                <FormLabel>Situação</FormLabel>
                <FormField
                  control={form.control}
                  name='situacao'
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

            <div className='space-y-4 rounded-lg border p-4'>
              <h3 className='text-lg font-semibold'>Contato</h3>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='telefone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='(11) 91234-5678'
                        maxLength={15}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='space-y-4 rounded-lg border p-4'>
              <h3 className='text-lg font-semibold'>Acesso</h3>
              <FormField
                control={form.control}
                name='usuario'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário *</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={20}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='senha'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Deixe em branco para manter'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmarSenha'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmação de Senha</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Repita a nova senha'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end gap-2 pt-4'>
              <DialogClose asChild>
                <Button
                  type='button'
                  variant='outline'
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarUsuario;
