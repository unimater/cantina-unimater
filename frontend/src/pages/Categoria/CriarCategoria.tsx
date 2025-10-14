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
import { categoriaSchema } from '@/lib/CategoriaSchema';
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
import type { Categoria } from '@/type/Categoria';

type FormValues = z.infer<typeof categoriaSchema>;

interface CriarCategoriaProps {
  onCategoriaCriada: (categoria: Categoria) => void;
  categoriasExistentes: Categoria[];
}

const CriarCategoria: React.FC<CriarCategoriaProps> = ({
  onCategoriaCriada,
  categoriasExistentes,
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      descricao: '',
      tipo: 'PRODUTO' as const,
      situacao: true,
    },
  });

  const onSubmit = (data: FormValues) => {
    const descricaoNormalizada = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const descricaoDuplicada = categoriasExistentes.some(
      c => descricaoNormalizada(c.descricao) === descricaoNormalizada(data.descricao)
    );

    if (descricaoDuplicada) {
      toast.error('Não foi possível salvar o registro!', {
        description: 'Já existe uma categoria com a mesma descrição. Verifique!',
      });
      return;
    }

    const novaCategoria: Categoria = {
      id: Date.now(),
      descricao: data.descricao,
      tipo: data.tipo,
      situacao: data.situacao,
    };

    onCategoriaCriada(novaCategoria);
    toast.success('Sucesso!', {
      description: 'A categoria foi incluída com sucesso.',
    });

    form.reset({
      descricao: '',
      tipo: 'PRODUTO',
      situacao: true,
    });
    setOpen(false);
  };

  const handleCancelar = () => {
    form.reset({
      descricao: '',
      tipo: 'PRODUTO',
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
        <Button className='cursor-pointer'>Nova Categoria</Button>
      </DialogTrigger>

      <DialogContent className='max-h-screen max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Cadastrar Categoria</DialogTitle>
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
                        placeholder='Digite a descrição da categoria'
                        {...field}
                      />
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
                disabled={form.formState.isSubmitting}
                className='cursor-pointer'
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

export default CriarCategoria;
