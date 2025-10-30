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

const ListarEstoque: React.FC = () => {

  const { data: estoque } = useQuery({
    queryKey: ['getMovimentacaoEstoque'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/estoque/movimentacoes');
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
              <TableHead className='text-center'>Quantidade</TableHead>
              <TableHead className='text-center'>Motivo</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead className='text-right'>Data de Criação</TableHead>
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
                <TableCell>{item.produto.descricao}</TableCell>
                <TableCell className='text-center'>{item.quantidade}</TableCell>
                <TableCell className='text-center'>{item.motivo}</TableCell>
                <TableCell>{item.observacoes}</TableCell>
                <TableCell>{item.usuario.name}</TableCell>
                <TableCell className='text-right'>{item.createdAt} </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ListarEstoque;
