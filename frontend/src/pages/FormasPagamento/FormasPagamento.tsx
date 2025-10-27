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
import { useState } from 'react';
import { toast } from 'sonner';
import CriarPagamento from './CriarFormaPagamento.tsx';
import EditarFormaPagamento from './EditarFormaPagamento.tsx';
import type { FormaPagamento } from '@/type/FormaPagamento.ts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api.ts';

const FormasPagamento: React.FC = () => {
  const [filtro, setFiltro] = useState('');
  const queryClient = useQueryClient();

  const { 
    data: formasPagamento = [], 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['getFormasPagamento'],
    queryFn: async () => {
      const response = await api.get('/formas-pagamento');
      return response.data as FormaPagamento[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/formas-pagamento/${id}`);
    },
    onSuccess: () => {
      toast.success('Forma de pagamento excluída com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['getFormasPagamento'] });
    },
    onError: (error: any) => {
      toast.error('Erro ao excluir Formas de pagamento', {
        description: error.response?.data?.message || error.message,
      });
    },  
  });

  const handleCriar = (_formaPagamento: FormaPagamento) => {
  };

  const handleAtualizar = (_formaPagamentoAtualizada: FormaPagamento) => {
  };

  const handleExcluir = (id: string) => {
    deleteMutation.mutate(id);
  };

  const formasFiltradas = formasPagamento.filter(c =>
    c.name?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <CardTitle>Formas de Pagamento</CardTitle>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                placeholder='Filtrar por nome...'
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                maxLength={150}
                className='pl-10'
              />
            </div>
            <CriarPagamento onFormaCriada={handleCriar} formasExistentes={formasPagamento} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formasFiltradas.map((forma) => (
              <TableRow key={forma.id}>
                <TableCell className="font-mono text-sm">{forma.id}</TableCell>
                <TableCell>{forma.name}</TableCell>
                <TableCell>
                  <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full ${
                      forma.status ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  {forma.status ? 'Ativo' : 'Inativo'}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <EditarFormaPagamento
                    formaPagamento={forma}
                    onFormaAtualizada={handleAtualizar}
                    formasExistentes={formasPagamento}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => forma.id && handleExcluir(forma.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FormasPagamento;