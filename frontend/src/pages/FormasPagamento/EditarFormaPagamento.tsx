import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import type { FormaPagamento } from './FormasPagamento';

// Schema de validação
const pagamentoSchema = z.object({
    nome: z
        .string()
        .min(2, 'O nome deve ter pelo menos 2 caracteres')
        .max(150, 'O nome não pode ultrapassar 150 caracteres'),
    ativo: z.boolean(),
});

type FormValues = z.infer<typeof pagamentoSchema>;

interface EditarPagamentoProps {
    formaPagamento: FormaPagamento;
    onFormaAtualizada: (forma: FormaPagamento) => void;
    formasExistentes: FormaPagamento[];
}

const EditarFormaPagamento: React.FC<EditarPagamentoProps> = ({
    formaPagamento,
    onFormaAtualizada,
    formasExistentes,
}) => {
    const [open, setOpen] = useState(false);
    const [temAlteracao, setTemAlteracao] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(pagamentoSchema),
        defaultValues: {
            nome: formaPagamento.nome,
            ativo: formaPagamento.ativo,
        },
    });

    const campos = form.watch();

    useEffect(() => {
        const tem = Object.values(campos).some(v => v !== '');
        setTemAlteracao(tem);
    }, [campos]);

    const onSubmit = (data: FormValues) => {
        const nomeNormalizado = (str: string) =>
            str
                .trim()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

        const nomeDuplicado = formasExistentes
            .filter(f => f.id !== formaPagamento.id)
            .some(f => nomeNormalizado(f.nome) === nomeNormalizado(data.nome));

        if (nomeDuplicado) {
            toast.error('Não foi possível salvar o registro!', {
                description: 'Já existe uma forma de pagamento com o mesmo nome.',
            });
            return;
        }

        const formaAtualizada: FormaPagamento = {
            ...formaPagamento,
            nome: data.nome,
            ativo: data.ativo,
        };

        onFormaAtualizada(formaAtualizada);
        toast.success('Sucesso!', {
            description: 'A forma de pagamento foi atualizada com sucesso.',
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
                <Button variant='outline' size='sm'>
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent className='max-h-screen max-w-md overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Editar Forma de Pagamento</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <div className='space-y-4 rounded-lg border p-4'>
                            <h3 className='text-lg font-semibold'>Identificação</h3>
                            <p className='text-muted-foreground text-sm'>ID: {formaPagamento.id}</p>

                            <FormField
                                control={form.control}
                                name='nome'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome *</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex items-center gap-2'>
                                <FormLabel>Ativo</FormLabel>
                                <FormField
                                    control={form.control}
                                    name='ativo'
                                    render={({ field }) => (
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='flex justify-end gap-2 pt-4'>
                            <DialogClose asChild>
                                <Button type='button' variant='outline'>
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type='submit' disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Atualizando...' : 'Atualizar'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditarFormaPagamento;