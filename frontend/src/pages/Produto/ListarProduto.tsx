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
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import CriarProduto from './CriarProduto';
import EditarProduto from './EditarProduto';
import type { Produto } from '@/type/Produto';

const categorias = [
  { id: '1', nome: 'Salgados' },
  { id: '2', nome: 'Bebidas' },
  { id: '3', nome: 'Doces' },
];

const currency = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

const ListarProdutos: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: 1,
      descricao: 'Pastel',
      situacao: true,
      valor: 5.0,
      createdAt: '',
      updatedAt: '',
      categoria: categorias[0],
    },
    {
      id: 2,
      descricao: 'Pão de Queijo',
      situacao: true,
      valor: 4.5,
      createdAt: '',
      updatedAt: '',
      categoria: categorias[0],
    },
    {
      id: 3,
      descricao: 'Coxinha',
      situacao: true,
      valor: 5.0,
      createdAt: '',
      updatedAt: '',
      categoria: categorias[0],
    },
    {
      id: 4,
      descricao: 'Refrigerante',
      situacao: true,
      valor: 5.0,
      createdAt: '',
      updatedAt: '',
      categoria: categorias[1],
    },
  ]);

  const [filtro, setFiltro] = useState('');

  const filtrados = useMemo(
    () =>
      produtos.filter((p) =>
        p.descricao.toLowerCase().includes(filtro.toLowerCase())
      ),
    [produtos, filtro]
  );

  const handleCriar = (novo: Produto) => {
    setProdutos((prev) => [...prev, { ...novo, id: prev.length + 1 }]);
  };

  const handleAtualizar = (atual: Produto) => {
    setProdutos((prev) => prev.map((p) => (p.id === atual.id ? atual : p)));
  };

  const handleExcluir = (id: number) => {
    if (confirm('Deseja realmente excluir este produto?')) {
      setProdutos((prev) => prev.filter((p) => p.id !== id));
      toast.success('Produto excluído com sucesso!');
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-semibold">Gerenciar Produtos</CardTitle>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Filtrar por descrição..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <CriarProduto onProdutoCriado={handleCriar} produtosExistentes={produtos} />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <colgroup>
            <col style={{ width: 80 }} />
            <col />
            <col style={{ width: 140 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 180 }} />
          </colgroup>

          <TableHeader>
            <TableRow>
              <TableHead className="text-left">ID</TableHead>
              <TableHead className="text-left">Descrição</TableHead>
              <TableHead className="text-left">Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-left">Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtrados.length ? (
              filtrados.map((p) => (
                <TableRow key={p.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">{p.id}</TableCell>
                  <TableCell>{p.descricao}</TableCell>
                  <TableCell>{p.categoria?.nome ?? '—'}</TableCell>
                  <TableCell className="text-right">{currency(p.valor)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          p.situacao ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      {p.situacao ? 'Ativo' : 'Inativo'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditarProduto
                        produto={p}
                        onProdutoAtualizado={handleAtualizar}
                        produtosExistentes={produtos}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 px-3 text-sm rounded-md align-middle inline-flex items-center justify-center"
                        onClick={() => handleExcluir(p.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-gray-500">
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
