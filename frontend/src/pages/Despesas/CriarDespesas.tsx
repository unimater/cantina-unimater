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
import type { Despesa } from '@/type/Despesa';

// Schema Despesa
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
interface CriarDespesaProps {
  onDespesaCriada: (despesa: Despesa) => void;
  despesasExistentes: Despesa[];
  usuarioAtual: string; // profissional responsável
}

const CriarDespesa: React.FC<CriarDespesaProps> = ({
  onDespesaCriada,
  despesasExistentes,
  usuarioAtual,
}) => {
  const [open, setOpen] = useState(false);
  const [temAlteracao, setTemAlteracao] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      descricao: '',
      categoria: '',
      data: new Date().toISOString().split('T')[0],
    },
  });

  const campos = form.watch();

  useEffect(() => {
    const tem = Object.values(campos).some(v => v);
    setTemAlteracao(tem);
  }, [campos]);

  const onSubmit = (data: FormValues) => {
    const descricaoNormalizada = (str: string) =>
      str
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const duplicada = despesasExistentes.some(
      u => descricaoNormalizada(u.descricao) === descricaoNormalizada(data.descricao)
    );

    if (duplicada) {
      toast.error('Não foi possível salvar!', {
        description: 'Já existe uma despesa com a mesma descrição.',
      });
      return;
    }

    // Gera ID sequencial
    const proximoId =
      despesasExistentes.length > 0
        ? Math.max(...despesasExistentes.map(d => d.id)) + 1
        : 0;

    const novaDespesa: Despesa = {
      id: proximoId,
      descricao: data.descricao,
      categoria: data.categoria,
      data: data.data,
      usuario: usuarioAtual,
    };

    onDespesaCriada(novaDespesa);
    toast.success('Sucesso!', {
      description: 'A despesa foi incluída com sucesso.',
    });
    form.reset();
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
        <Button>Nova Despesa</Button>
      </DialogTrigger>

      <DialogContent className="max-h-screen max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Despesa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Identificação</h3>

              {/* Identificador (bloqueado) */}
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input
                    value={
                      despesasExistentes.length > 0
                        ? Math.max(...despesasExistentes.map(d => d.id)) + 1
                        : 0
                    }
                    disabled
                  />
                </FormControl>
              </FormItem>

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

              {/* Profissional responsável */}
              <FormItem>
                <FormLabel>Profissional Responsável</FormLabel>
                <FormControl>
                  <Input value={usuarioAtual} disabled />
                </FormControl>
              </FormItem>

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
                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CriarDespesa;