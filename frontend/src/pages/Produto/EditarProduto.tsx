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
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Produto } from '@/type/Produto';
import { produtoSchema } from '@/lib/ProdutoSchema';
import { NumericFormat } from 'react-number-format';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FormValues = z.infer<typeof produtoSchema>;

const categorias = [
  { id: '1', nome: 'Salgados' },
  { id: '2', nome: 'Bebidas' },
  { id: '3', nome: 'Doces' },
];

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

    const categoriaSelecionada = categorias.find(
      (c) => c.id === data.categoriaId
    )!;

    const produtoAtualizado: Produto = {
      ...produto,
      descricao: data.nome.trim(),
      valor: data.valor,
      situacao: data.situacao,
      categoria: categoriaSelecionada,
      updatedAt: new Date().toISOString(),
    };

    onProdutoAtualizado(produtoAtualizado);
    toast.success('Produto atualizado com sucesso!');
    setOpen(false);
  };

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
          className="h-8 px-3 text-sm rounded-md hover:bg-gray-100"
        >
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
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

            {/* Valor */}
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

            {/* Categoria */}
            <FormField
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Situação */}
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
