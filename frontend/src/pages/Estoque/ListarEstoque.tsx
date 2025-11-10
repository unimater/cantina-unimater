import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CriarPagamento from './CriarEstoque.tsx';
import type { Estoque } from '@/type/Estoque.ts';
import { PackageCheck, PackageMinus } from 'lucide-react';
import { ConsultarEstoque } from './ConsultarEstoque.tsx';
import { useState } from 'react';

const ListarEstoque: React.FC = () => {

  const [filtros, setFiltros] = useState({
    tipo: '',
    produtoId: '',
    usuarioId: '',
    dataInicio: undefined as Date | undefined,
    dataFim: undefined as Date | undefined,
  });

  const { data: estoque } = useQuery({
  queryKey: [
    'getMovimentacaoEstoque',
    filtros.tipo,
    filtros.produtoId,
    filtros.usuarioId,
    filtros.dataInicio,
    filtros.dataFim,
  ],
  queryFn: async () => {
    const params = new URLSearchParams();
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.produtoId) params.append('produtoId', filtros.produtoId);
    if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio.toISOString());
    if (filtros.dataFim) {
    const dataFim = new Date(filtros.dataFim);
      dataFim.setHours(23, 59, 59, 999);
      params.append('dataFim', dataFim.toISOString());
    }


    const response = await axios.get(`http://localhost:3000/estoque/movimentacoes?${params.toString()}`);
      return response.data as Estoque[];
    },
  });
  
  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <CardTitle>Consulta de estoque</CardTitle>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='relative'>
            </div>
            <ConsultarEstoque onFiltrar={ setFiltros }/>
            <CriarPagamento />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className='text-center'>Quantidade <br /> Movimentada</TableHead>
              <TableHead className='text-center'>Quantidade <br /> Estoque</TableHead>
              <TableHead className='text-center'>Quantidade <br /> Mínima</TableHead>
              <TableHead className='text-center'>Motivo</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead className='text-center'>Data <br /> Movimentação</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {estoque?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {
                    item.tipo === 'ENTRADA' ? <PackageCheck color='green' /> : <PackageMinus color='red' />
                  }
                </TableCell>
                <TableCell>{item.produto?.descricao}</TableCell>
                <TableCell className='text-center'>{item.quantidade}</TableCell>
                <TableCell className='text-center'>{item.produto?.quantidadeEstoque}</TableCell>
                <TableCell className='text-center'>{item.produto?.estoqueMinimo}</TableCell>
                <TableCell className='text-center'>{item.motivo}</TableCell>
                <TableCell>{item.observacoes}</TableCell>
                <TableCell>{item.usuario?.name}</TableCell>
                <TableCell className='text-center'>
                  {new Date(item.createdAt!!).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ListarEstoque;
