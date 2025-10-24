import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useState } from 'react';
import { toast } from 'sonner';
import type { FormaPagamento } from '@/type/FormaPagamento';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';

const pagamentoSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(150, 'O nome não pode ultrapassar 150 caracteres'),
  status: z.boolean(),
});

type FormValues = z.infer<typeof pagamentoSchema>;

interface CriarPagamentoProps {
  onFormaCriada: (novaForma: FormaPagamento) => void;
  formasExistentes: FormaPagamento[];
}

const CriarPagamento: React.FC<CriarPagamentoProps> = ({
  onFormaCriada,
  formasExistentes,
}) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (novaFormaPagamento: Omit<FormaPagamento, 'id'>) => {
      const response = await api.post('/formas-pagamento', novaFormaPagamento);
      return response.data;
    },
    onSuccess: formaPagamentoCriada => {
      queryClient.invalidateQueries({ queryKey: ['getFormasPagamento'] });
      onFormaCriada(formaPagamentoCriada);
      toast.success('Sucesso!', {
        description: 'A Forma de Pagamento foi incluída com sucesso.',
      });
      form.reset({
        name: '',
        status: true
      });
      setOpen(false);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || error.message || 'Não foi possível salvar a Forma de Pagamento.';
      toast.error('Erro!', {
        description: message,
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(pagamentoSchema),
    defaultValues: {
      name: '',
      status: true,
    },
  });

  const onSubmit = (data: FormValues) => {
    const nomeNormalizado = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const nomeDuplicado = formasExistentes.some(
      f => nomeNormalizado(f.name) === nomeNormalizado(data.name)
    );

    if (nomeDuplicado) {
      toast.error('Não foi possível criar o registro!', {
        description: 'Já existe uma forma de pagamento com o mesmo nome.',
      });
      return;
    }

    const novaForma: FormaPagamento = {
      name: data.name.trim(),
      status: data.status,
    };
    
    createMutation.mutate(novaForma);

    onFormaCriada(novaForma);
    toast.success('Sucesso!', {
      description: 'A forma de pagamento foi criada com sucesso.',
    });
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nova Forma de Pagamento</Button>
      </DialogTrigger>

      <DialogContent className='max-h-screen max-w-md overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Nova Forma de Pagamento</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} 
            className='space-y-6'
          >
            <div className='space-y-4 rounded-lg border p-4'>
              <h3 className='text-lg font-semibold'>Informações Gerais</h3>

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder='Ex: Cartão de Crédito, PIX etc...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center gap-2'>
                <FormLabel>Ativo</FormLabel>
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  )}
                />
              </div>
            </div>

            <div className='flex justify-end gap-2 pt-4'>
              <DialogClose asChild>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    form.reset();
                    setOpen(false);
                  }}
                >
                  Cancelar
                </Button>
              </DialogClose>

              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CriarPagamento;