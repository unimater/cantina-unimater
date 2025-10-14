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
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Despesa } from '@/type/Despesa';

// Schema
const despesaSchema = z.object({
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(100, 'Máximo de 100 caracteres'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  data: z
    .string()
    .refine(value => {
      const data = new Date(value);
      const hoje = new Date();
      return data <= hoje;
    }, 'Não é permitido registrar uma data futura.'),
});

type FormValues = z.infer<typeof despesaSchema>;

interface EditarDespesaProps {
  despesa: Despesa;
  onDespesaAtualizada: (despesa: Despesa) => void;
  despesasExistentes: Despesa[];
}

const EditarDespesa: React.FC<EditarDespesaProps> = ({
  despesa,
  onDespesaAtualizada,
  despesasExistentes,
}) => {
  const [open, setOpen] = useState(false);
  const [temAlteracao, setTemAlteracao] = useState(false);

 const form = useForm<FormValues>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      descricao: despesa.descricao || '',
      categoria: despesa.categoria || '',
      data: despesa.data || new Date().toISOString().split('T')[0],
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

   const duplicada = despesasExistentes
      .filter(d => d.id !== despesa.id)
      .some(d => nomeNormalizado(d.descricao) === nomeNormalizado(data.descricao));

    if (duplicada) {
      toast.error('Não foi possível salvar o registro!', {
        description: 'Já existe uma despesa com a mesma descrição. Verifique!',
      });
      return;
    }

    const despesaAtualizada: Despesa = {
      ...despesa,
      descricao: data.descricao,
      categoria: data.categoria,
      data: data.data,
    };

    onDespesaAtualizada(despesaAtualizada);
    toast.success('Sucesso!', {
      description: 'A despesa foi atualizada com sucesso.',
    });
    setOpen(false);
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
        <Button variant="outline" size="sm">
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-screen max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Despesa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* CARD: Identificação */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Identificação</h3>
              <p className="text-muted-foreground text-sm">ID: {despesa.id}</p>

              {/* Descrição */}
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite a descrição completa"
                        maxLength={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoria */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Moradia, Transporte, Impostos e Taxas..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data */}
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
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