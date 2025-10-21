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
import type { FormaPagamento } from './FormasPagamento';

const pagamentoSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(150, 'O nome não pode ultrapassar 150 caracteres'),
  ativo: z.boolean(),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(pagamentoSchema),
    defaultValues: {
      nome: '',
      ativo: true,
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
      f => nomeNormalizado(f.nome) === nomeNormalizado(data.nome)
    );

    if (nomeDuplicado) {
      toast.error('Não foi possível criar o registro!', {
        description: 'Já existe uma forma de pagamento com o mesmo nome.',
      });
      return;
    }

    const novaForma: FormaPagamento = {
      id: formasExistentes.length ? Math.max(...formasExistentes.map(f => f.id)) + 1 : 1,
      nome: data.nome.trim(),
      ativo: data.ativo,
    };

    onFormaCriada(novaForma);
    toast.success('Sucesso!', {
      description: 'A forma de pagamento foi criada com sucesso.',
    });

    form.reset();
    setOpen(false);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4 rounded-lg border p-4'>
              <h3 className='text-lg font-semibold'>Informações Gerais</h3>

              <FormField
                control={form.control}
                name='nome'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder='Ex: Cartão de Crédito' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center gap-2'>
                <FormLabel>Ativo</FormLabel>
                <FormField
                  control={form.control}
                  name='ativo'
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