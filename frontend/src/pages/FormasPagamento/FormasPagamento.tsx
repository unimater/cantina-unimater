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

export type FormaPagamento = {
  id: number;
  nome: string;
  ativo: boolean;
};

const FormasPagamento: React.FC = () => {
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([
    {
      id: 1,
      nome: 'Cartão de Crédito',
      ativo: true,
    },
    {
      id: 2,
      nome: 'Pix',
      ativo: true,
    },
  ]);

  const [filtro, setFiltro] = useState('');

  const handleCriar = (novaForma: FormaPagamento) => {
    setFormasPagamento(prev => [...prev, novaForma]);
    toast.success('Forma de pagamento criada com sucesso!');
  };

  const handleAtualizar = (formaAtualizada: FormaPagamento) => {
    setFormasPagamento(prev =>
      prev.map(f => (f.id === formaAtualizada.id ? formaAtualizada : f))
    );
    toast.success('Forma de pagamento atualizada!');
  };

  const handleExcluir = (id: number) => {
    if (
      confirm(
        'Ao excluir o item não será possível reverter. Deseja realmente prosseguir com a ação?'
      )
    ) {
      setFormasPagamento(prev => prev.filter(f => f.id !== id));
      toast.success('Excluído', { description: 'A forma de pagamento foi removida com sucesso.' });
    }
  };

  const formasFiltradas = formasPagamento.filter(f =>
    f.nome.toLowerCase().includes(filtro.toLowerCase())
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
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formasFiltradas.length > 0 ? (
              formasFiltradas.map(forma => (
                <TableRow key={forma.id}>
                  <TableCell className='font-mono text-sm'>{forma.id}</TableCell>
                  <TableCell>{forma.nome}</TableCell>
                  <TableCell>
                    <span
                      className={`mr-2 inline-block h-2 w-2 rounded-full ${forma.ativo ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    />
                    {forma.ativo ? 'Ativo' : 'Inativo'}
                  </TableCell>
                  <TableCell className='space-x-2 text-right'>
                    <EditarFormaPagamento
                      formaPagamento={forma}
                      onFormaAtualizada={handleAtualizar}
                      formasExistentes={formasPagamento}
                    />
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleExcluir(forma.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='text-muted-foreground py-6 text-center'>
                  Nenhuma forma de pagamento encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FormasPagamento;