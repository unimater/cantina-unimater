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
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import CriarProduto from './CriarProduto';
import EditarProduto from './EditarProduto';
import type { Produto } from '@/type/Produto';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/api/api';

const ListarProdutos: React.FC = () => {
  const [filtro, setFiltro] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['getProdutos'],
    queryFn: () => api.get("/produtos")
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/produtos/${id}`),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao tentar excluir o produto.');
    },
  });

  useEffect(() => {
    if (data?.data) {
      setProdutos(data?.data)
    }
  }, [data])
  
  const filtrados = useMemo(
    () =>
      produtos.filter((p) =>
        (p.descricao ?? '').toLowerCase().includes(filtro.toLowerCase())
      ),
    [produtos, filtro]
  );

  const handleExcluir = (id: string) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;

  deleteMutation
    .mutate(id, {
      onSuccess: () => {
        setProdutos((prev) => prev.filter((p) => p.id !== id));
        toast.success('Produto excluído com sucesso!');
      }
    });
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
          <CriarProduto produtosExistentes={produtos} />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <colgroup>
            <col style={{ width: 200 }} />
            <col style={{ width: 200 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 120 }} />
            <col style={{ width: 140 }} />
          </colgroup>

          <TableHeader>
            <TableRow className="h-10">
              <TableHead className="text-left px-3 py-2">Descrição</TableHead>
              <TableHead className="text-left px-3 py-2">Categoria</TableHead>
              <TableHead className="text-right px-3 py-2">Valor</TableHead>
              <TableHead className="text-left px-3 py-2">Situação</TableHead>
              <TableHead className="text-right px-3 py-2">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-blue-500"></div>
                    Carregando produtos...
                  </div>
                </TableCell>
              </TableRow>
            ) : filtrados.length ? (
              filtrados.map((p) => (
                <TableRow key={p.id} className="hover:bg-gray-50 h-10">
                  <TableCell className="px-3 py-2">{p.descricao}</TableCell>
                  <TableCell className="px-3 py-2">{p.categoria?.descricao ?? '—'}</TableCell>
                  <TableCell className="px-3 py-2 text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.valor)}</TableCell>
                  <TableCell className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          p.situacao ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      {p.situacao ? 'Ativo' : 'Inativo'}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <EditarProduto
                        produto={p}
                        produtosExistentes={produtos}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 px-3 text-sm rounded-md"
                        onClick={() => handleExcluir(p.id!)}
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
