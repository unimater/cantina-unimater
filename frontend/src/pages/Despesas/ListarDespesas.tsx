import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Despesa } from '@/type/Despesa';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CriarDespesa from './CriarDespesas';
import EditarDespesa from './EditarDespesas';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

const ListarDespesas: React.FC = () => {
  const { data } = useQuery<{ data: Despesa[] }>({
    queryKey: ['getDespesas'],
    queryFn: () => axios.get('http://localhost:3000/despesas'),
  });

  const [filtro, setFiltro] = useState('');

  const handleExcluir = () => {
    if (
      confirm(
        'Ao excluir a despesa não será possível reverter. Deseja realmente prosseguir com a ação?'
      )
    ) {
      toast.success('Excluído', { description: 'Despesa foi removida com sucesso.' });
    }
  };

  const despesasFiltradas = data?.data?.filter(u =>
    u.descricao.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <CardTitle>Despesas</CardTitle>
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
            <CriarDespesa />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className='w-[150px]'>Fornecedor</TableHead>
              <TableHead className='w-[120px] text-right'>Valor</TableHead>
              <TableHead className='w-[120px] text-center'>Data</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead className='w-[120px] text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {despesasFiltradas && despesasFiltradas?.length > 0 ? (
              despesasFiltradas?.map(despesa => (
                <TableRow key={despesa.id}>
                  <TableCell className='font-medium'>{despesa.descricao}</TableCell>

                  <TableCell>{despesa.fornecedor || 'Não Informado'}</TableCell>

                  <TableCell className='text-right'>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(Number(despesa.valor))}
                  </TableCell>

                  <TableCell className='text-center'>
                    {format(parseISO(despesa.data), 'dd/MM/yyyy')}
                  </TableCell>

                  <TableCell className='max-w-[200px] truncate'>
                    {despesa.observacoes || '-'}
                  </TableCell>

                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <EditarDespesa despesa={despesa} />
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleExcluir()}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-muted-foreground py-6 text-center'
                >
                  Nenhuma despesa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ListarDespesas;
