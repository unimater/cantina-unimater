import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';

export default function Fechamento() {
  const navigate = useNavigate();

  const [dataInicial, setDataInicial] = React.useState<string>('');
  const [dataFinal, setDataFinal] = React.useState<string>('');
  const [formaPagamentoSelecionada, setFormaPagamentoSelecionada] = React.useState<string>('');
  const [produtoSelecionado, setProdutoSelecionado] = React.useState<string>('');
  const [categoriaSelecionada, setCategoriaSelecionada] = React.useState<string>('');

  const { data: formasPagamento = [] } = useQuery({
    queryKey: ['getFormasPagamento'],
    queryFn: async () => {
      const response = await api.get('/formas-pagamento');
      return response.data as any[];
    },
  });

  const { data: produtos = [] } = useQuery({
    queryKey: ['getProdutos'],
    queryFn: async () => {
      const response = await api.get('/produtos');
      return response.data as any[];
    },
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ['getCategorias'],
    queryFn: async () => {
      const response = await api.get('/categorias');
      return response.data as any[];
    },
  });

  function handleGerar() {
    const filters = {
      periodo: { dataInicial, dataFinal },
      formasPagamento: formaPagamentoSelecionada ? [formaPagamentoSelecionada] : [],
      produtos: produtoSelecionado ? [produtoSelecionado] : [],
      categorias: categoriaSelecionada ? [categoriaSelecionada] : [],
    };

    navigate('/fechamento/relatorio', { state: { filters } });
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Filtros</CardTitle>
        </CardHeader>

        <CardContent className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
                <label className='block text-sm font-medium text-gray-700'>Início</label>
                <Input type='date' value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700'>Fim</label>
                <Input type='date' value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700'>Forma de Pagamento</label>
                <Select onValueChange={(v) => setFormaPagamentoSelecionada(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione' />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(formasPagamento) ? formasPagamento : []).map((f: any) => (
                          <SelectItem key={f.id} value={String(f.id)}>{f.name || f.nome}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700'>Produto</label>
                <Select onValueChange={(v) => setProdutoSelecionado(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione' />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(produtos) ? produtos : []).map((p: any) => (
                          <SelectItem key={p.id} value={String(p.id)}>{p.descricao || p.nome}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className='block text-sm font-medium text-gray-700'>Categoria</label>
                <Select onValueChange={(v) => setCategoriaSelecionada(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione' />
                    </SelectTrigger>
                    <SelectContent>
                      {(Array.isArray(categorias) ? categorias : []).map((c: any) => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.descricao || c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
            </div>

            <div className='md:col-span-3 flex justify-end'>
                <Button className='cursor-pointer' onClick={handleGerar}>Gerar relatório</Button>
            </div>
        </CardContent>
    </Card>
  );
}
