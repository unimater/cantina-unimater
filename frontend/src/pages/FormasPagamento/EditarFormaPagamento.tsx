import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import type { FormaPagamento } from '@/type/FormaPagamento';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema de validação
const pagamentoSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(150, 'O nome não pode ultrapassar 150 caracteres'),
  status: z.boolean(),
});

type FormValues = z.infer<typeof pagamentoSchema>;

interface EditarPagamentoProps {
  formaPagamento: FormaPagamento;
}

const EditarFormaPagamento: React.FC<EditarPagamentoProps> = ({ formaPagamento }) => {
  const [open, setOpen] = useState(false);
  const [temAlteracao, setTemAlteracao] = useState(false);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (formaPagamentoAtualizada: FormaPagamento) => {
      const response = await axios.patch(
        `http://localhost:3000/formas-pagamento/${formaPagamento.id}`,
        formaPagamentoAtualizada
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getFormasPagamento'] });

      toast.success('Sucesso!', {
        description: 'A Formas de Pagamento foi atualizada com sucesso.',
      });
      setOpen(false);
    },
    onError: (error: { response: { data: { message: string } } }) => {
      const message =
        error.response?.data?.message || 'Não foi possível atualizar a Forma de Pagamento.';
      toast.error('Erro!', {
        description: message,
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(pagamentoSchema),
    defaultValues: {
      name: formaPagamento.name,
      status: formaPagamento.status,
    },
  });

  const campos = form.watch();

  useEffect(() => {
    const tem = Object.values(campos).some(v => v !== '');
    setTemAlteracao(tem);
  }, [campos]);

  const onSubmit = (data: FormValues) => {
    const formaAtualizada: FormaPagamento = {
      ...formaPagamento,
      name: data.name,
      status: data.status,
    };

    updateMutation.mutate(formaAtualizada);

    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen && temAlteracao) {
          setOpen(false);
          form.reset();
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
      <DialogContent className='max-h-screen max-w-md overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Editar Forma de Pagamento</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='space-y-4 rounded-lg border p-4'>
              <h3 className='text-lg font-semibold'>Identificação</h3>
              <p className='text-muted-foreground text-sm'>ID: {formaPagamento.id}</p>

              <FormField
                control={form.control}
                name='name'
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

              <div className='flex items-center gap-2'>
                <FormLabel>Ativo</FormLabel>
                <FormField
                  control={form.control}
                  name='status'
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

export default EditarFormaPagamento;
