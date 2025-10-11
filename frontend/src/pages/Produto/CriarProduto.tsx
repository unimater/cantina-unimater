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
import { Plus } from 'lucide-react';

type FormValues = z.infer<typeof produtoSchema>;

interface CriarProdutoProps {
  onProdutoCriado: (produto: Produto) => void;
  produtosExistentes: Produto[];
}

const CriarProduto: React.FC<CriarProdutoProps> = ({
  onProdutoCriado,
  produtosExistentes,
}) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: '',
      valor: 0,
      situacao: true,
    },
  });

  const onSubmit = (data: FormValues) => {
    const duplicado = produtosExistentes.some(
      (p) => p.descricao.trim().toLowerCase() === data.nome.trim().toLowerCase()
    );

    if (duplicado) {
      toast.error('Já existe um produto com esse nome!');
      return;
    }

    const novoProduto: Produto = {
      id: Date.now(),
      descricao: data.nome.trim(),
      valor: data.valor,
      situacao: data.situacao,
      createdAt: new Date().toISOString(),
      updatedAt: '',
    };

    onProdutoCriado(novoProduto);
    toast.success('Produto criado com sucesso!');
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);
        if (state) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Novo Produto
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
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
                        // combina o ref do hook form + seu inputRef local
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

export default CriarProduto;
