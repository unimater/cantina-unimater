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
import type { Produto } from '@/type/Produto';
import { produtoSchema } from '@/lib/ProdutoSchema';

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
  const [temAlteracao, setTemAlteracao] = useState(false);

  const form = useForm({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      situacao: produto.situacao ?? true,
    },
  });

  const campos = form.watch();

  useEffect(() => {
    const { ...outros } = campos;
    const tem = Object.values(outros).some(v => v);
    setTemAlteracao(tem);
  }, [campos]);

  const onSubmit = (data: FormValues) => {

    const produtoAtualizado: Produto = {
      ...produto,
      descricao: data.nome,
      situacao: data.situacao,
    };

    onProdutoAtualizado(produtoAtualizado);
    toast.success('Sucesso!', {
      description: 'O produto foi atualizado com sucesso.',
    });
    setOpen(false);
  };

  return (
    <Button
      variant='outline'
      size='sm'
    >
      Editar
    </Button>
  );
};

export default EditarProduto;
