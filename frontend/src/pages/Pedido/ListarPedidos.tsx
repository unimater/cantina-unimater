import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import CriarPedido from './CriarPedido';
import EditarPedido from './EditarPedido';
import { toast } from 'sonner';
import type { Pedido } from '@/type/Pedido';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const ListarPedido: React.FC = () => {
  const [filtro, setFiltro] = useState('');
  const queryClient = useQueryClient();

  const { data: pedidos = [], error } = useQuery({
    queryKey: ['getPedidos'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/pedido');
      return response.data as Pedido[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/pedido/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getPedidos'] });
      toast.success('Pedido excluído com sucesso!');
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error('Erro ao excluir pedido', {
        description: error.response?.data?.message || 'Não foi possível excluir o pedido.',
      });
    },
  });

  useEffect(() => {
    if (error) {
      toast.error('Erro ao carregar pedidos', {
        description: (error as Error).message,
      });
    }
  }, [error]);

  const handleCriar = () => {
    queryClient.invalidateQueries({ queryKey: ['getPedidos'] });
  };

  const handleAtualizar = () => {
    queryClient.invalidateQueries({ queryKey: ['getPedidos'] });
  };

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      deleteMutation.mutate(id);
    }
  };

  const pedidosFiltrados = pedidos.filter(p =>
    p.descricao?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <CardTitle>Pedidos</CardTitle>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                placeholder='Filtrar por descrição...'
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                maxLength={150}
                className='pl-10'
              />
            </div>
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
              <TableHead>Situação</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidosFiltrados.length > 0 ? (
              pedidosFiltrados.map(pedido => (
                <TableRow key={`pedido-${pedido.id}`}>
                  <TableCell>{pedido.descricao}</TableCell>

                  {/* ✅ Campo corrigido e formatado */}
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(Number(pedido.total || 0))}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`mr-2 inline-block h-2 w-2 rounded-full ${
                        pedido.situacao ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    {pedido.situacao ? 'Ativo' : 'Inativo'}
                  </TableCell>
                  <TableCell className='space-x-2 text-right'>
                    <EditarPedido
                      key={`editar-pedido-${pedido.id}`}
                      pedido={pedido}
                      onPedidoAtualizado={handleAtualizar}
                      pedidosExistentes={pedidos}
                    />
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => pedido.id && handleExcluir(pedido.id)}
                      className='cursor-pointer'
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-muted-foreground py-6 text-center'
                >
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ListarPedido;
