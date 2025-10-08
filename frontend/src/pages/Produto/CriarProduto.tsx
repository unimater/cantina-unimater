import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Produto } from '@/type/Produto';
import { produtoSchema } from '@/lib/ProdutoSchema';

type FormValues = z.infer<typeof produtoSchema>;

interface CriarProdutoProps {
  onProdutoCriado: (produto: Produto) => void;
  produtosExistentes: Produto[];
}

const CriarProduto: React.FC<CriarProdutoProps> = ({ onProdutoCriado, produtosExistentes }) => {
  const [open, setOpen] = useState(false);
  const [temAlteracao, setTemAlteracao] = useState(false);

  const form = useForm({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      situacao: true,
    },
  });

  const campos = form.watch();

  useEffect(() => {
    const { ...outros } = campos;
    const tem = Object.values(outros).some(v => v);
    setTemAlteracao(tem);
  }, [campos]);

  const onSubmit = (data: FormValues) => {

    const novoProduto: Produto = {
      id: Date.now(),
      descricao: data.nome,
      situacao: data.situacao,
      valor: 0,
      createdAt: ''
    };

    onProdutoCriado(novoProduto);
    toast.success('Sucesso!', {
      description: 'O produto foi incluído com sucesso.',
    });
    form.reset();
    setOpen(false);
  };

  return (
    <DialogTrigger asChild>
      <Button>Novo Produto</Button>
    </DialogTrigger>
  );
};

export default CriarProduto;
