import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// ✅ Schema de validação com Zod
const itemSchema = z.object({
  produtoId: z.string().min(1, "Produto obrigatório"),
  quantidade: z.number().min(1, "Mínimo 1 unidade"),
  precoUnitario: z.number().min(0, "Preço inválido"),
  subtotal: z.number(),
})

const pedidosSchema = z.object({
  descricao: z.string().min(1, "Descrição obrigatória"),
  categoria: z.enum(["PRODUTO", "DESPESA"]),
  situacao: z.boolean(),
  itens: z.array(itemSchema).min(1, "Adicione ao menos 1 item"),
})

type FormValues = z.infer<typeof pedidosSchema>

interface CriarPedidosProps {
  onPedidosCriado: () => void
  pedidosExistentes: any[]
}

const CriarPedido: React.FC<CriarPedidosProps> = ({ onPedidosCriado }) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(pedidosSchema),
    defaultValues: {
      descricao: "",
      categoria: "PRODUTO",
      situacao: true,
      itens: [{ produtoId: "", quantidade: 1, precoUnitario: 0, subtotal: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  })

  // ✅ Tipagem explícita para evitar 'any'
  const itens = form.watch("itens") as {
    produtoId: string
    quantidade: number
    precoUnitario: number
    subtotal: number
  }[]

  const { setValue } = form

  // 🔹 Atualiza subtotais automaticamente
  useEffect(() => {
    itens.forEach((item, index) => {
      const subtotal = item.quantidade * item.precoUnitario
      setValue(`itens.${index}.subtotal`, subtotal)
    })
  }, [itens, setValue])

  // 🔹 Calcula total geral (com tipagem explícita)
  const total = itens.reduce(
    (acc: number, item: { subtotal: number }) => acc + item.subtotal,
    0
  )

  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await axios.post("http://localhost:3000/pedidos", {
        ...data,
        total,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPedidos"] })
      toast.success("Pedido criado com sucesso!")
      setOpen(false)
      onPedidosCriado()
      form.reset()
    },
    onError: (error: any) => {
      toast.error("Erro ao criar pedido", {
        description:
          error.response?.data?.message || "Falha ao salvar o pedido.",
      })
    },
  })

  const onSubmit = (data: FormValues) => {
    if (data.itens.length === 0) {
      toast.error("Adicione pelo menos um item ao pedido.")
      return
    }
    createMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-gray-800">
          Novo Pedido
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Criar Pedido</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição do pedido" {...field} />
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
                      {...field}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="PRODUTO">Produto</option>
                      <option value="DESPESA">Despesa</option>
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
              <span>{form.watch("situacao") ? "Ativo" : "Inativo"}</span>
            </div>

            {/* Itens do Pedido */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <FormLabel>Itens do Pedido</FormLabel>
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      produtoId: "",
                      quantidade: 1,
                      precoUnitario: 0,
                      subtotal: 0,
                    })
                  }
                >
                  + Adicionar Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-5 gap-2 items-center"
                >
                  <Input
                    placeholder="Produto ID"
                    {...form.register(`itens.${index}.produtoId`)}
                    className="col-span-2"
                  />
                  <Input
                    type="number"
                    placeholder="Qtd"
                    {...form.register(`itens.${index}.quantidade`, {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Preço"
                    {...form.register(`itens.${index}.precoUnitario`, {
                      valueAsNumber: true,
                    })}
                  />
                  <Input
                    type="number"
                    readOnly
                    value={itens[index]?.subtotal?.toFixed(2) || "0.00"}
                    className="bg-gray-100"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-end items-center gap-2 pt-4">
              <span className="text-gray-700 font-semibold">Total:</span>
              <span className="text-lg font-bold">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Salvando..." : "Salvar Pedido"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CriarPedido
