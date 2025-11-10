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
import { pedidoSchema } from '@/lib/PedidoSchema'; // Crie o PedidoSchema.ts
import type { Pedido } from '@/type/Pedido'; // Crie o tipo Pedido.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type FormValues = z.infer<typeof pedidoSchema>;

interface EditarPedidoProps {
  pedido: Pedido;
  onPedidoAtualizado: (pedido: Pedido) => void;
  pedidosExistentes: Pedido[];
}

const EditarPedido: React.FC<EditarPedidoProps> = ({
  pedido,
  onPedidoAtualizado,
  pedidosExistentes,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (pedidoAtualizado: Pedido) => {
      const response = await axios.patch(
        `http://localhost:3000/pedido/${pedido.id}`,
        pedidoAtualizado
      );
      return response.data;
    },
    onSuccess: pedidoAtualizadoDoBackend => {
      queryClient.invalidateQueries({ queryKey: ['getPedidos'] });
      onPedidoAtualizado(pedidoAtualizadoDoBackend);
      toast.success('Sucesso!', {
        description: 'O pedido foi atualizado com sucesso.',
      });
      form.reset({
        descricao: '',
        valorTotal: 0,
        situacao: true,
      });
      setOpen(false);
    },
    onError: (error: { response: { data: { message: string } } }) => {
      const message = error.response?.data?.message || 'Não foi possível atualizar o pedido.';
      toast.error('Erro!', {
        description: message,
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      descricao: pedido.descricao || '',
      valorTotal: pedido.valorTotal || 0,
      situacao: pedido.situacao ?? true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        descricao: pedido.descricao || '',
        valorTotal: pedido.valorTotal || 0,
        situacao: pedido.situacao ?? true,
      });
    }
  }, [open, pedido.id, form, pedido]);

  const onSubmit = (data: FormValues) => {
    const descricaoNormalizada = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const descricaoDuplicada = pedidosExistentes
      .filter(p => p.id !== pedido.id)
      .some(p => descricaoNormalizada(p.descricao) === descricaoNormalizada(data.descricao));

    if (descricaoDuplicada) {
      toast.error('Não foi possível salvar o pedido!', {
        description: 'Já existe um pedido com a mesma descrição. Verifique!',
      });
      return;
    }

    const pedidoAtualizado: Pedido = {
      ...pedido,
      descricao: data.descricao,
      valorTotal: data.valorTotal,
      situacao: data.situacao,
    };

    updateMutation.mutate(pedidoAtualizado);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
        >
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Editar Pedido</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <p className='text-muted-foreground text-sm'>ID: {pedido.id}</p>

            <FormField
              control={form.control}
              name='descricao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='valorTotal'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Total *</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Atualizando...' : 'Atualizar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarPedido;
