import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import CriarPedido from './CriarPedido'
import EditarPedido from './EditarPedido'
import { toast } from 'sonner'
import type { Pedidos } from '@/type/Pedidos'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const ListarPedido: React.FC = () => {
  const [filtro, setFiltro] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<string>('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const queryClient = useQueryClient()

  // 🔹 Buscar pedidos — agora usando /pedidos
  const { data: pedidos = [], error, isFetching } = useQuery({
    queryKey: ['getPedidos', filtro, statusFiltro, dataInicio, dataFim],
    queryFn: async () => {
      const params: Record<string, string> = {}

      if (statusFiltro) params.status = statusFiltro
      if (dataInicio) params.dataInicio = dataInicio
      if (dataFim) params.dataFim = dataFim

      const response = await axios.get('http://localhost:3000/pedidos', { params })
      return response.data as Pedidos[]
    },
  })

  // 🔹 Exclusão
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/pedidos/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPedidos'] })
      toast.success('Pedido excluído com sucesso!')
    },
    onError: (error: any) => {
      toast.error('Erro ao excluir pedido', {
        description:
          error.response?.data?.message ||
          'Não foi possível excluir o pedido.',
      })
    },
  })

  // 🔹 Erro ao carregar
  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar pedidos', {
        description: (error as Error).message,
      })
    }
  }, [error])

  const handleCriar = () => queryClient.invalidateQueries({ queryKey: ['getPedidos'] })
  const handleAtualizar = () => queryClient.invalidateQueries({ queryKey: ['getPedidos'] })

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleLimparFiltros = () => {
    setFiltro('')
    setStatusFiltro('')
    setDataInicio('')
    setDataFim('')
  }

  // 🔹 Filtro por descrição
  const pedidosFiltrados = pedidos.filter(p =>
    p.descricao?.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="shadow-lg border-gray-200">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Pedidos
            </CardTitle>

            {/* 🔹 Filtros */}
            <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
              
              {/* 🔍 Buscar descrição */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="text-gray-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Buscar descrição..."
                  value={filtro}
                  onChange={e => setFiltro(e.target.value)}
                  className="pl-9 pr-3 py-2 h-9 text-sm"
                />
              </div>

              {/* 📅 Datas */}
              <Input
                type="date"
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
                className="w-[150px] h-9 text-sm"
                title="Data Inicial"
              />

              <Input
                type="date"
                value={dataFim}
                onChange={e => setDataFim(e.target.value)}
                className="w-[150px] h-9 text-sm"
                title="Data Final"
              />

              {/* 🏷️ Status */}
              <select
                value={statusFiltro}
                onChange={e => setStatusFiltro(e.target.value)}
                className="h-9 rounded-md border border-gray-300 px-3 text-sm bg-white"
              >
                <option value="">Todos</option>
                <option value="FINALIZADO">Finalizados</option>
                <option value="CANCELADO">Cancelados</option>
              </select>

              {/* ❌ Limpar */}
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300 hover:bg-gray-100"
                onClick={handleLimparFiltros}
              >
                Limpar
              </Button>

              {/* ➕ Novo */}
              <CriarPedido
                onPedidoCriado={handleCriar}
                pedidosExistentes={pedidos}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <AnimatePresence>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Carregando pedidos...
                    </TableCell>
                  </TableRow>
                ) : pedidosFiltrados.length > 0 ? (
                  pedidosFiltrados.map(pedido => (
                    <motion.tr
                      key={`pedido-${pedido.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <TableCell>{pedido.descricao}</TableCell>

                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(Number(pedido.total || 0))}
                      </TableCell>

                      <TableCell>{pedido.status}</TableCell>

                      <TableCell>
                        <span
                          className={`mr-2 inline-block h-2 w-2 rounded-full ${
                            pedido.situacao ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        {pedido.situacao ? 'Ativo' : 'Inativo'}
                      </TableCell>

                      <TableCell className="space-x-2 text-right">
                        <EditarPedido
                          key={`editar-${pedido.id}`}
                          pedido={pedido}
                          onPedidoAtualizado={handleAtualizar}
                          pedidosExistentes={pedidos}
                        />

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => pedido.id && handleExcluir(pedido.id)}
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-gray-500"
                    >
                      Nenhum pedido encontrado.
                    </TableCell>
                  </motion.tr>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ListarPedido
