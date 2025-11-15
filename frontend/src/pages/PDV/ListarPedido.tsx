import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Status, type Pedido } from '@/type/Pedido';

const currency = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

const ListarPedidos: React.FC = () => {
  const [produtos, setProdutos] = useState<Pedido[]>([
    {
      id: 1,
      numero: 1,
      status: Status.PENDENTE,
      valorTotal: 5.0,
      createdAt: '',
      updatedAt: '',
      formaPagamento: 'Dinheiro',
      descontoTotal: 0.0,
      produtos: [],
    },
    {
      id: 2,
      numero: 2,
      status: Status.ENTREGUE,
      valorTotal: 4.5,
      createdAt: '',
      updatedAt: '',
      formaPagamento: 'Dinheiro',
      descontoTotal: 0.0,
      produtos: [],
    },
    {
      id: 3,
      numero: 3,
      status: Status.CANCELADO,
      valorTotal: 5.0,
      createdAt: '',
      updatedAt: '',
      formaPagamento: 'Dinheiro',
      descontoTotal: 0.0,
      produtos: [],
    },
    {
      id: 4,
      numero: 4,
      status: Status.PENDENTE,
      valorTotal: 5.0,
      createdAt: '',
      updatedAt: '',
      formaPagamento: 'Dinheiro',
      descontoTotal: 0.0,
      produtos: [],
    },
    {
      id: 4,
      numero: 4,
      status: null,
      valorTotal: 5.0,
      createdAt: '',
      updatedAt: '',
      formaPagamento: 'Dinheiro',
      descontoTotal: 0.0,
      produtos: [],
    },
  ]);

  const [filtro, setFiltro] = useState('');

  const filtrados = useMemo(
    () => produtos.filter(p => p.numero.toString().includes(filtro.toLowerCase())),
    [produtos, filtro]
  );

  return (
    <Card className='shadow-sm'>
      <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <CardTitle className='text-lg font-semibold'>Gerenciar Pedidos</CardTitle>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <div className='relative'>
            <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              placeholder='Filtrar por número do pedido...'
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className='w-64 pl-9'
            />
          </div>
          {/* <CriarPedido onProdutoCriado={handleCriar} produtosExistentes={produtos} /> */}
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <colgroup>
            <col style={{ width: 40 }} />
            <col style={{ width: 40 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 180 }} />
          </colgroup>

          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>ID</TableHead>
              <TableHead className='text-left'>Número</TableHead>
              <TableHead className='text-left'>Status</TableHead>
              <TableHead className='text-left'>Forma de pagamento</TableHead>
              <TableHead className='text-right'>Valor total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtrados.length ? (
              filtrados.map(p => (
                <TableRow
                  key={p.id}
                  className='hover:bg-gray-50'
                >
                  <TableCell className='font-mono text-sm'>{p.id}</TableCell>
                  <TableCell>{p.numero}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          p.status === Status.PENDENTE
                            ? 'bg-yellow-500'
                            : p.status === Status.ENTREGUE
                            ? 'bg-green-500'
                            : p.status === Status.CANCELADO
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                        }`}
                      />
                      {p.status}
                    </div>
                  </TableCell>
                  <TableCell>{p.formaPagamento}</TableCell>
                  <TableCell className='text-right'>{currency(p.valorTotal)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='py-6 text-center text-gray-500'
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

export default ListarPedidos;
