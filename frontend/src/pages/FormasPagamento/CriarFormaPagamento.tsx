import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { useEffect, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

const formaPagamentoSchema = z.object({
    nome: z.string().min(1, 'O nome é obrigatório'),
    situacao: z.boolean().default(true),
})

type FormValues = z.infer<typeof formaPagamentoSchema>

interface CriarFormaPagamentoProps {
    onCriado: (forma: { id: number; nome: string; situacao: boolean }) => void
    existentes: { id: number; nome: string; situacao: boolean }[]
}

export default function CriarFormaPagamento({
    onCriado,
    existentes,
}: CriarFormaPagamentoProps) {
    const [open, setOpen] = useState(false)
    const [temAlteracao, setTemAlteracao] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formaPagamentoSchema) as unknown as Resolver<FormValues>,
        defaultValues: {
            nome: '',
            situacao: true,
        },
    })

    const campos = form.watch()

    useEffect(() => {
        const tem = Object.values(campos).some(v => v)
        setTemAlteracao(tem)
    }, [campos])

    const onSubmit = (data: FormValues) => {
        const nomeNormalizado = (str: string) =>
            str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

        const duplicado = existentes.some(
            f => nomeNormalizado(f.nome) === nomeNormalizado(data.nome)
        )

        if (duplicado) {
            toast.error('Não foi possível salvar o registro!', {
                description: 'Já existe uma forma de pagamento com o mesmo nome.',
            })
            return
        }

        const nova = {
            id: Date.now(),
            nome: data.nome,
            situacao: data.situacao,
        }

        onCriado(nova)
        toast.success('Sucesso!', { description: 'Forma de pagamento criada com sucesso.' })
        form.reset()
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={isOpen => {
                if (!isOpen && temAlteracao) {
                    if (confirm('Você possui alterações não salvas. Deseja realmente sair?')) {
                        setOpen(false)
                        form.reset()
                    }
                } else {
                    setOpen(isOpen)
                }
            }}
        >
            <DialogTrigger asChild>
                <Button>Nova Forma de Pagamento</Button>
            </DialogTrigger>
            <DialogContent className='max-h-screen max-w-md overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Cadastrar Forma de Pagamento</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        <div className='space-y-4 rounded-lg border p-4'>
                            <FormField
                                control={form.control}
                                name='nome'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome *</FormLabel>
                                        <FormControl>
                                            <Input placeholder='Ex: Cartão de Crédito' {...field} />
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
                            <DialogClose asChild>
                                <Button type='button' variant='outline'>
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type='submit' disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}