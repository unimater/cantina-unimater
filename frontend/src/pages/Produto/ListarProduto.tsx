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
import EditarProduto from './EditarProduto';
import type { Produto } from '@/type/Produto';
import { toast } from 'sonner';
import CriarProduto from './CriarProduto';

const ListarProdutos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: 1,
      descricao: 'Pastel',
      situacao: true,
      valor: 5.00,
      createdAt: Date.now().toString(),
      updatedAt: ''
    },
    {
      id: 2,
      descricao: 'Pão de Queijo',
      situacao: false,
      valor: 4.50,
      createdAt: Date.now().toString(),
      updatedAt: ''
    }
  ]);

  const [filtro, setFiltro] = useState('');

  const handleCriar = (novoProduto: Produto) => {
    setProdutos(prev => [...prev, novoProduto]);
  };

  const handleAtualizar = (produtoAtualizado: Produto) => {
    setProdutos(prev => prev.map(u => (u.id === produtoAtualizado.id ? produtoAtualizado : u)));
  };

  const handleExcluir = (id: number) => {
    if (
      confirm(
        'Ao excluir o item não será possível reverter. Deseja realmente prosseguir com a ação?'
      )
    ) {
      setProdutos(prev => prev.filter(u => u.id !== id));
      toast.success('Excluído', { description: 'O produto foi removido com sucesso.' });
    }
  };

  const produtosFiltrados = produtos.filter(u =>
    u.descricao.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <CardTitle>Produtos</CardTitle>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                placeholder='Filtrar por descrição...'
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                maxLength={300}
                className='pl-10'
              />
            </div>
            <CriarProduto
              onProdutoCriado={handleCriar}
              produtosExistentes={produtos}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtosFiltrados.length > 0 ? (
              produtosFiltrados.map(produto => (
                <TableRow key={produto.id}>
                  <TableCell className='font-mono text-sm'>{produto.id}</TableCell>
                  <TableCell>{produto.descricao}</TableCell>
                  <TableCell>{produto.valor}</TableCell>
                  <TableCell>
                    <span
                      className={`mr-2 inline-block h-2 w-2 rounded-full ${
                        produto.situacao ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    {produto.situacao ? 'Ativo' : 'Inativo'}
                  </TableCell>
                  <TableCell className='space-x-2 text-right'>
                    <EditarProduto
                      produto={produto}
                      onProdutoAtualizado={handleAtualizar}
                      produtosExistentes={produtos}
                    />
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleExcluir(produto.id)}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-muted-foreground py-6 text-center'
                >
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ListarProdutos;
