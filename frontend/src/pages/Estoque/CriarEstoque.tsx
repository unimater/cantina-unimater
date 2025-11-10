import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Estoque } from '@/type/Estoque';
import type { Produto } from '@/type/Produto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { PackageCheck, PackageMinus } from 'lucide-react';

const estoqueSchema = z.object({
  produtoId: z
    .string()
    .min(1, "Selecione um produto"),
  usuarioId: z.string(),
  tipo: z.enum(['ENTRADA', 'SAIDA']),
  motivo: z
    .string()
    .min(3, "Descreva o motivo da movimentação")
    .max(255, "Máximo de caractéres é 255"),
  quantidade: 
  z.string().min(1, 'Valor é obrigatório')
    .refine(quantidade => !isNaN(Number(quantidade.replace(',', '.'))), 'Valor inválido'),
  observacoes: z
  .string()
  .max(255, "Máximo de caractéres é 255"),
});

type FormValues = z.infer<typeof estoqueSchema>;

const CriarEstoque = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (novaMovimentacaoEstoque: Omit<Estoque, 'id'>) => {
      const response = await axios.post(
        'http://localhost:3000/estoque/movimentacao',
        novaMovimentacaoEstoque
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMovimentacaoEstoque'] });
      toast.success('Sucesso!', {
        description: 'A movimentação de estoque foi incluída com sucesso.',
      });
      form.reset({
        produtoId: '',
        usuarioId: '',
        tipo: 'ENTRADA',
        motivo: '',
        quantidade: '',
        observacoes: ''
      });
      setOpen(false);
    },
    onError: (error: { response: { data: { message: string } } }) => {
      const message =
        error.response?.data?.message || 'Não foi possível salvar a movimentação de estoque.';
      toast.error('Erro!', {
        description: message,
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(estoqueSchema),
    defaultValues: {
      produtoId: '',
      usuarioId: '',
      tipo: 'ENTRADA',
      motivo: '',
      quantidade: '',
      observacoes: ''
    },
  });

  const onSubmit = (data: FormValues) => {
    const novaMovimentacaoEstoque: Estoque = {
      produtoId: data.produtoId,
      usuarioId: data.usuarioId,
      tipo: data.tipo,
      motivo: data.motivo,
      quantidade: data.quantidade,
      observacoes: data.observacoes
    };

    createMutation.mutate(novaMovimentacaoEstoque);
  };

  const { data: produto } = useQuery({
    queryKey: ['getProdutos'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/produtos');
      return response.data as Produto[];
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>Nova Movimentação de Estoque</Button>
      </DialogTrigger>

      <DialogContent className='max-h-screen max-w-md overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Nova Movimentação de Estoque</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='space-y-4 rounded-lg border p-4'>
              <h3 className='text-lg font-semibold'>Informações Gerais</h3>

              <FormField
                control={form.control}
                name='produtoId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produto *</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Produto..." />
                        </SelectTrigger>
                        <SelectContent>
                          {produto?.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.descricao}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='usuarioId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuario *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Usuario...'
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tipo..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Tipo</SelectLabel>
                              <SelectItem value="ENTRADA"><span className='flex'><PackageCheck className='pr-1' color='green'/>Entrada</span></SelectItem>
                              <SelectItem value="SAIDA"><span className='flex'><PackageMinus className='pr-1' color='red'/>Saída</span></SelectItem>
                            </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='motivo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Motivo da movimentação...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='quantidade'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='observacoes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>observacoes *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Observações...'
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
                  onClick={() => {
                    form.reset();
                    setOpen(false);
                  }}
                >
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
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

export default CriarEstoque;
