import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { pedidoSchema } from '@/lib/PedidoSchema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Pedido } from '@/type/Pedido'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

// ✅ Tipagem do formulário com base no schema Zod
type FormValues = z.infer<typeof pedidoSchema>

interface CriarPedidoProps {
  onPedidoCriado: (pedido: Pedido) => void
  pedidosExistentes: Pedido[]
}

const CriarPedido: React.FC<CriarPedidoProps> = ({
  onPedidoCriado,
  pedidosExistentes,
}) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()


    const form = useForm<z.infer<typeof pedidoSchema>>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      descricao: '',
      total: 0,
      categoria: 'PRODUTO',
      situacao: true,
    },
  })

  const createMutation = useMutation({
    mutationFn: async (novoPedido: Omit<Pedido, 'id'>) => {
      const response = await axios.post('http://localhost:3000/pedido', novoPedido)
      return response.data
    },
    onSuccess: pedidoCriado => {
      queryClient.invalidateQueries({ queryKey: ['getPedidos'] })
      onPedidoCriado(pedidoCriado)
      toast.success('Sucesso!', {
        description: 'O pedido foi incluído com sucesso.',
      })
      form.reset({
        descricao: '',
        total: 0,
        categoria: 'PRODUTO',
        situacao: true,
      })
      setOpen(false)
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Não foi possível criar o pedido.'
      toast.error('Erro ao criar pedido', { description: message })
    },
  })

  const onSubmit = (data: FormValues) => {
    // Normaliza e evita descrições duplicadas
    const descricaoDuplicada = pedidosExistentes.some(
      p => p.descricao.toLowerCase() === data.descricao.toLowerCase()
    )

    if (descricaoDuplicada) {
      toast.error('Já existe um pedido com essa descrição.')
      return
    }

    // ✅ Cria o pedido
    const novoPedido = {
      descricao: data.descricao,
      total: Number(data.total),
      categoria: data.categoria,
      situacao: data.situacao,
    }

    createMutation.mutate(novoPedido as any)
  }

  const handleCancelar = () => {
    form.reset({
      descricao: '',
      total: 0,
      categoria: 'PRODUTO',
      situacao: true,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Novo Pedido</Button>
      </DialogTrigger>

      <DialogContent className="max-h-screen max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Pedido</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4">
              {/* Descrição */}
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a descrição do pedido" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Valor */}
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Digite o valor total do pedido"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoria */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded border px-3 py-2"
                        {...field}
                      >
                        <option value="PRODUTO">PRODUTO</option>
                        <option value="DESPESA">DESPESA</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Situação */}
              <div className="flex items-center gap-2">
                <FormLabel>Situação</FormLabel>
                <FormField
                  control={form.control}
                  name="situacao"
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

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelar}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="cursor-pointer"
              >
                {createMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CriarPedido
