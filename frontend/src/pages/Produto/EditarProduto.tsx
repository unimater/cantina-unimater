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
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Produto } from '@/type/Produto';
import { produtoSchema } from '@/lib/ProdutoSchema';
import { NumericFormat } from 'react-number-format';
import { PencilLine } from 'lucide-react';
import type { Categoria } from '@/type/Categoria';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/api/api';

type FormValues = z.infer<typeof produtoSchema>;

interface EditarProdutoProps {
  produto: Produto;
  onProdutoAtualizado: (produto: Produto) => void;
  produtosExistentes: Produto[];
}

const EditarProduto: React.FC<EditarProdutoProps> = ({
  produto,
  onProdutoAtualizado,
  produtosExistentes,
}) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const { data: categorias, isLoading: categoriasLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const response = await api.get<Categoria[]>('/categorias');
      return response.data;
    },
    enabled: open
  });

  const updateMutation = useMutation({
    mutationFn: (produto: Produto) => {
      return api.patch(`/produtos/${produto.id}`, { 
        descricao: produto.descricao,
        valor: produto.valor,
        situacao: produto.situacao,
        categoriaId: produto.categoria.id
       });
    },
    onSuccess: (data) => {
      onProdutoAtualizado(data.data)
    },
    onError: (data: { response: { data: { message: string } } }) => {
      toast.error(data.response.data.message || 'Erro ao criar produto.');
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: produto.descricao,
      valor: produto.valor,
      situacao: produto.situacao,
      categoriaId: produto.categoria?.id ?? '',
    },
  });

  const onSubmit = (data: FormValues) => {
    const duplicado = produtosExistentes.some(
      (p) =>
        p.descricao.trim().toLowerCase() === data.nome.trim().toLowerCase() &&
        p.id !== produto.id
    );

    if (duplicado) {
      toast.error('Já existe um produto com esse nome!');
      return;
    }

    const categoriaSelecionada = categorias?.find(c => c.id === data.categoriaId);

    if (!categoriaSelecionada) {
      toast.error('Selecione uma categoria válida!');
      return;
    }

    const produtoAtualizado: Produto = {
      ...produto,
      descricao: data.nome.trim(),
      valor: data.valor,
      situacao: data.situacao,
      categoria: categoriaSelecionada,
      updatedAt: new Date().toISOString(),
    };

    updateMutation.mutate(produtoAtualizado)
    toast.success('Produto atualizado com sucesso!');
    setOpen(false);
  };

  useEffect(() => {
    if (categorias && categorias.length > 0) {
      form.setValue('categoriaId', produto.categoria?.id ?? '');
    }
  }, [categorias, produto.categoria?.id]);

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        if (state) setTimeout(() => inputRef.current?.focus(), 100);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-sm rounded-md align-middle inline-flex items-center justify-center hover:bg-gray-100"
        >
          <PencilLine size={14} className="mr-1" /> Editar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Pão de Queijo"
                      ref={(el) => {
                        field.ref(el);
                        inputRef.current = el;
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <NumericFormat
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      customInput={Input}
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    {categoriasLoading ? (
                      <Input placeholder="Carregando categorias..." disabled />
                    ) : (
                      <select
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full"
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias?.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.descricao}
                          </option>
                        ))}
                      </select>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="situacao"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <FormLabel className="text-sm font-medium">Situação</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarProduto;
