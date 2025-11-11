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

// ✅ Mesmo tipo usado no CriarPedido
type FormValues = z.infer<typeof pedidoSchema>

interface EditarPedidoProps {
  pedido: Pedido
  onPedidoAtualizado: () => void
  pedidosExistentes: Pedido[]
}

const EditarPedido: React.FC<EditarPedidoProps> = ({
  pedido,
  onPedidoAtualizado,
  pedidosExistentes,
}) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // ✅ Tipagem explícita — remove o erro do onSubmit
  const form = useForm<FormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      descricao: pedido.descricao || '',
      total: Number(pedido.total) || 0,
      categoria: (pedido.categoria as 'PRODUTO' | 'DESPESA') || 'PRODUTO',
      situacao: pedido.situacao ?? true,
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (dadosAtualizados: Partial<Pedido>) => {
      const response = await axios.patch(
        `http://localhost:3000/pedido/${pedido.id}`,
        dadosAtualizados
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPedidos'] })
      onPedidoAtualizado()
      toast.success('Sucesso!', {
        description: 'O pedido foi atualizado com sucesso.',
      })
      setOpen(false)
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Não foi possível atualizar o pedido.'
      toast.error('Erro ao atualizar pedido', { description: message })
    },
  })

  const onSubmit = (data: FormValues) => {
    const descricaoDuplicada = pedidosExistentes.some(
      p =>
        p.descricao.toLowerCase() === data.descricao.toLowerCase() &&
        p.id !== pedido.id
    )

    if (descricaoDuplicada) {
      toast.error('Já existe um pedido com essa descrição.')
      return
    }

    const pedidoAtualizado = {
      descricao: data.descricao,
      total: Number(data.total),
      categoria: data.categoria,
      situacao: data.situacao,
    }

    updateMutation.mutate(pedidoAtualizado)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Pedido</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            {/* Botões */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditarPedido
