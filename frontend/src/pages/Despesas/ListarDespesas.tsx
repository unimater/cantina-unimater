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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CriarDespesa from './CriarDespesas';
import EditarDespesa from './EditarDespesas';


const ListarDespesas: React.FC = () => {
  const queryClient = useQueryClient()

  const { data } = useQuery<{ data: Despesa[] }>({
    queryKey: ['getDespesas'],
    queryFn: () => axios.get('http://localhost:3000/despesas'),
  });

  const mutation = useMutation({
    mutationFn: (idDespesa: string) => axios.delete(`http://localhost:3000/despesas/${idDespesa}`),
    onSuccess: () => {
      toast('Despesa removida com sucesso');
      queryClient.invalidateQueries({ queryKey: ['getDespesas'] })
    }
  })

  const [filtro, setFiltro] = useState('');

  const despesasFiltradas = data?.data?.filter(u =>
    u.descricao.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleExcluir = (idDespesa: string) => {
    mutation.mutate(idDespesa)
  }

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
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[200px] text-center">Fornecedor</TableHead>
              <TableHead className="w-[200px] text-center">Valor</TableHead>
              <TableHead className="w-[200px] text-center">Observação</TableHead>
              <TableHead className="w-[200px] text-center">Data</TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {despesasFiltradas && despesasFiltradas.length > 0 ? (
              despesasFiltradas.map(despesa => (
                <TableRow key={despesa.id}>
                  <TableCell>{despesa.descricao}</TableCell>

                  <TableCell className="text-center font-mono">
                    {despesa.fornecedor}
                  </TableCell>

                  <TableCell className="text-center font-mono">
                    {despesa.valor}            
                  </TableCell>

                  <TableCell className="text-center font-mono">
                    {despesa.observacao || "Não Informado"}
                  </TableCell>

                  <TableCell className="text-center font-mono">
                    {despesa.data}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <EditarDespesa
                        despesa={despesa}
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
