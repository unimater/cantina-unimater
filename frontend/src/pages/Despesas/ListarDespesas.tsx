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
import CriarDespesa from './CriarDespesas';
import EditarDespesa from './EditarDespesas';
import type { Despesa } from '@/type/Despesa';
import { toast } from 'sonner';

const ListarDespesas: React.FC = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([
    {
      id: 1,
      descricao: 'Energia Elétrica',
      categoria: 'Moradia',
      usuario: 'ana.silva',
    },
  ]);

  const [filtro, setFiltro] = useState('');

  const handleCriar = (novaDespesa: Despesa) => {
    setDespesas(prev => [...prev, novaDespesa]);
  };

  const handleAtualizar = (despesaAtualizada: Despesa) => {
    setDespesas(prev =>
      prev.map(u => (u.id === despesaAtualizada.id ? despesaAtualizada : u))
    );
  };

  const handleExcluir = (id: number) => {
    if (
      confirm(
        'Ao excluir a despesa não será possível reverter. Deseja realmente prosseguir com a ação?'
      )
    ) {
      setDespesas(prev => prev.filter(u => u.id !== id));
      toast.success('Excluído', { description: 'Despesa foi removida com sucesso.' });
    }
  };

  const despesasFiltradas = despesas.filter(u =>
    u.descricao.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <CardTitle>Despesas</CardTitle>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Filtrar por descrição..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
                maxLength={150}
                className="pl-10"
              />
            </div>
            <CriarDespesa
              onDespesaCriada={handleCriar}
              despesasExistentes={despesas}
              usuarioAtual="ana.silva"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[80px] text-center">ID</TableHead>
      <TableHead>Descrição</TableHead>
      <TableHead className="w-[200px] text-center">Categoria</TableHead>
      <TableHead className="w-[120px] text-right">Ações</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {despesasFiltradas.length > 0 ? (
      despesasFiltradas.map(despesa => (
        <TableRow key={despesa.id}>
          <TableCell className="font-mono text-sm text-center">
            {despesa.id}
          </TableCell>

          <TableCell>{despesa.descricao}</TableCell>

          <TableCell className="text-center font-mono">
            {despesa.categoria}
          </TableCell>

          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <EditarDespesa
                despesa={despesa}
                onDespesaAtualizada={handleAtualizar}
                despesasExistentes={despesas}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleExcluir(despesa.id)}
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
          colSpan={4}
          className="text-muted-foreground py-6 text-center"
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
