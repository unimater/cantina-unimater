import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { pedidoSchema } from '@/lib/PedidoSchema'; // VERIFICAR PQ N IMPORTA
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Pedido } from '@/type/Pedido'; // VERIFICAR PQ NAO IMPORTA 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type FormValues = z.infer<typeof pedidoSchema>;

interface CriarPedidoProps {
  onPedidoCriado: (pedido: Pedido) => void;
  pedidosExistentes: Pedido[];
}

const CriarPedido: React.FC<CriarPedidoProps> = ({
  onPedidoCriado,
  pedidosExistentes,
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (novoPedido: Omit<Pedido, 'id'>) => {
      const response = await axios.post('http://localhost:3000/pedido', novoPedido);
      return response.data;
    },
    onSuccess: pedidoCriado => {
      queryClient.invalidateQueries({ queryKey: ['getPedidos'] });
      onPedidoCriado(pedidoCriado);
      toast.success('Sucesso!', {
        description: 'O pedido foi incluído com sucesso.',
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
      descricao: '',
      valorTotal: 0,
      situacao: true,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data)
    const descricaoNormalizada = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const descricaoDuplicada = pedidosExistentes.some(
      p => descricaoNormalizada(p.descricao) === descricaoNormalizada(data.descricao)
    );

    if (descricaoDuplicada) {
      toast.error('Não foi possível salvar o pedido!', {
        description: 'Já existe um pedido com a mesma descrição. Verifique!',
      });
      return;
    }

   const novoPedido = {
      descricao: data.descricao,
      valorTotal: data.valorTotal,
      situacao: data.situacao,
      categoria: data.categoria, // vem do form (FormValues)
      createdAt: new Date().toISOString(),
    };
    console.log(novoPedido)
    createMutation.mutate(novoPedido);
  };

  const handleCancelar = () => {
    form.reset({
      descricao: '',
      valorTotal: 0,
      situacao: true,
    });
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className='cursor-pointer'>Novo Pedido</Button>
      </DialogTrigger>

      <DialogContent className='max-h-screen max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Cadastrar Pedido</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='space-y-4 rounded-lg border p-4'>
              <FormField
                control={form.control}
                name='descricao'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Digite a descrição do pedido'
                        {...field}
                      />
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
                    <FormLabel>Valor *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Digite o valor total do pedido'
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

            <div className='flex justify-end gap-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                className='cursor-pointer'
                onClick={handleCancelar}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                disabled={createMutation.isPending}
                className='cursor-pointer'
              >
                {createMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CriarPedido;
