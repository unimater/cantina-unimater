import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { usuarioSchemaCriar } from '@/lib/UsuarioSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Usuario } from '@/type/Usuario';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';

type FormValues = z.infer<typeof usuarioSchemaCriar>;

interface CriarUsuarioProps {
  onUsuarioCriado: (usuario: Usuario) => void;
  usuariosExistentes: Usuario[];
}

const CriarUsuario: React.FC<CriarUsuarioProps> = ({ onUsuarioCriado, usuariosExistentes }) => {
  const [open, setOpen] = useState(false);
  const [temAlteracao, setTemAlteracao] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (novoUsuario: Omit<Usuario, 'id'>) => {
      const response = await api.post('http://localhost:3000/users', novoUsuario);
      return response.data;
    },
    onSuccess: usuarioCriado => {
      queryClient.invalidateQueries({ queryKey: ['getUsuarios'] });
      onUsuarioCriado(usuarioCriado);
      toast.success('Sucesso!', {
        description: 'O usuário foi incluído com sucesso.',
      });
      form.reset();
      setOpen(false);
    },
    onError: (error: { response: { data: { message: string } } }) => {
      const message = error.response?.data?.message || 'Não foi possível criar o usuário.';

      toast.error('Erro!', {
        description: message,
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(usuarioSchemaCriar),
    defaultValues: {
      situacao: true,
      nome: '',
      cpf: '',
      usuario: '',
      senha: '',
      confirmarSenha: '',
      email: '',
      telefone: '',
    },
  });

  const campos = form.watch();

  useEffect(() => {
    const { ...outros } = campos;
    const tem = Object.values(outros).some(v => v);
    setTemAlteracao(tem);
  }, [campos]);

  const onSubmit = (data: FormValues) => {
    const nomeNormalizado = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const nomeDuplicado = usuariosExistentes.some(
      u => nomeNormalizado(u.name) === nomeNormalizado(data.nome)
    );

    if (nomeDuplicado) {
      toast.error('Não foi possível salvar o registro!', {
        description: 'Já existe um usuário com a mesma descrição. Verifique!',
      });
      return;
    }

    const loginDuplicado = usuariosExistentes.some(u => u.username === data.usuario);
    if (loginDuplicado) {
      toast.error('Não foi possível salvar o registro!', {
        description: 'O nome de usuário já está em uso por outro usuário. Verifique!',
      });
      return;
    }

    const novoUsuario: Usuario = {
      name: data.nome,
      cpf: data.cpf,
      active: data.situacao,
      email: data.email || undefined,
      phone: data.telefone || undefined,
      username: data.usuario,
      password: data.senha,
    };

    createMutation.mutate(novoUsuario);
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
        <Button>Novo Usuário</Button>
      </DialogTrigger>
      <DialogContent className='max-h-screen max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Cadastrar Usuário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <div className='space-y-4 rounded-lg border p-4'>
              <h3 className='text-lg font-semibold'>Identificação</h3>
              <FormField
                control={form.control}
                name='nome'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Digite o nome completo'
                        {...field}
                      />
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
                        placeholder='exemplo@faculdade.edu'
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
                        placeholder='ex: ana.silva'
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
                    <FormLabel>Senha *</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='••••••••'
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
                    <FormLabel>Confirmação de Senha *</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Repita a senha'
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
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CriarUsuario;
