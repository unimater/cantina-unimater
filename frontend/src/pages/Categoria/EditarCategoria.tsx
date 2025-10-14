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
import { categoriaSchema } from '@/lib/CategoriaSchema';
import type { Categoria } from '@/type/Categoria';

type FormValues = z.infer<typeof categoriaSchema>;

interface EditarCategoriaProps {
  categoria: Categoria;
  onCategoriaAtualizada: (categoria: Categoria) => void;
  categoriasExistentes: Categoria[];
}

const EditarCategoria: React.FC<EditarCategoriaProps> = ({
  categoria,
  onCategoriaAtualizada,
  categoriasExistentes,
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      descricao: categoria.descricao || '',
      tipo: categoria.tipo || ('PRODUTO' as const),
      situacao: categoria.situacao ?? true,
    },
  });

  // Reset form quando abrir
  useEffect(() => {
    if (open) {
      form.reset({
        descricao: categoria.descricao || '',
        tipo: categoria.tipo || ('PRODUTO' as const),
        situacao: categoria.situacao ?? true,
      });
    }
  }, [open, categoria.id, form]);

  const onSubmit = (data: FormValues) => {
    const descricaoNormalizada = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const descricaoDuplicada = categoriasExistentes
      .filter(c => c.id !== categoria.id)
      .some(c => descricaoNormalizada(c.descricao) === descricaoNormalizada(data.descricao));

    if (descricaoDuplicada) {
      toast.error('Não foi possível salvar o registro!', {
        description: 'Já existe uma categoria com a mesma descrição. Verifique!',
      });
      return;
    }

    const categoriaAtualizada: Categoria = {
      ...categoria,
      descricao: data.descricao,
      tipo: data.tipo,
      situacao: data.situacao,
    };

    onCategoriaAtualizada(categoriaAtualizada);
    toast.success('Sucesso!', {
      description: 'A categoria foi atualizada com sucesso.',
    });
    setOpen(false);
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
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <p className='text-muted-foreground text-sm'>ID: {categoria.id}</p>

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
              name='tipo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className='border-input ring-offset-background focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      <option value=''>Selecione o tipo</option>
                      <option value='PRODUTO'>Produto</option>
                      <option value='DESPESA'>Despesa</option>
                    </select>
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

export default EditarCategoria;
