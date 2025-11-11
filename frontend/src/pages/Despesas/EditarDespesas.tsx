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
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Despesa } from '@/type/Despesa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import api from '@/api/api';

const despesaSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória').max(100, 'Máximo de 100 caracteres'),
  fornecedor: z.string().min(1, 'Fornecedor é obrigatório').max(100, 'Máximo de 100 caracteres'),
  valor: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine(value => !isNaN(Number(value.replace(',', '.'))), 'Valor inválido'),
  data: z.string().refine(value => {
    const data = new Date(value);
    const hoje = new Date();
    return data <= hoje;
  }, 'Não é permitido registrar uma data futura.'),
  observacoes: z.string().max(500, 'Máximo de 500 caracteres').optional(),
});

type FormValues = z.infer<typeof despesaSchema>;

interface EditarDespesaProps {
  despesa: Despesa;
}

const EditarDespesa = ({ despesa }: EditarDespesaProps) => {
  const [open, setOpen] = useState(false);
  const [temAlteracao, setTemAlteracao] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      descricao: despesa.descricao || '',
      fornecedor: despesa.fornecedor || '',
      valor: despesa.valor || '',
      data: despesa.data
        ? format(parseISO(despesa.data), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      observacoes: despesa.observacoes || '',
    },
  });

  const campos = form.watch();

  useEffect(() => {
    const tem = Object.values(campos).some(v => v);
    setTemAlteracao(tem);
  }, [campos]);

  const mutation = useMutation({
    mutationFn: (despesaAtualizada: {
      descricao: string;
      fornecedor: string;
      valor: string;
      data: string;
      observacoes: string;
    }) => api.patch(`http://localhost:3000/despesas/${despesa.id}`, despesaAtualizada),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getDespesas'],
      });

      toast.success('Sucesso!', {
        description: 'A despesa foi atualizada com sucesso.',
      });

      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate({
      descricao: data.descricao,
      fornecedor: data.fornecedor,
      valor: data.valor.replace(',', '.'),
      data: data.data,
      observacoes: data.observacoes || '',
    });
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
          <DialogTitle>Editar Despesa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='space-y-4 rounded-lg border p-4'>
              <h3 className='text-lg font-semibold'>Identificação</h3>

              <FormField
                control={form.control}
                name='descricao'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Digite a descrição da despesa'
                        maxLength={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='fornecedor'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nome do fornecedor ou empresa'
                        maxLength={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='valor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='0,00'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='data'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data *</FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          max={new Date().toISOString().split('T')[0]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='observacoes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Informações adicionais sobre a despesa (opcional)'
                        maxLength={500}
                        rows={4}
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

export default EditarDespesa;
