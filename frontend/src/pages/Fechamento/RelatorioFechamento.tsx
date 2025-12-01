import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function RelatorioFechamento() {
  const navigate = useNavigate();
  const filters = useLocation().state?.filters || {};

  const [vendas, setVendas] = React.useState<any[]>([]);
  const [sumario, setSumario] = React.useState<any>(null);

  const mutation = useMutation({
    mutationFn: async (filters) => {
      const response = await api.post('/venda/fechamento-caixa', filters);
      return response.data;
    },
    onSuccess: (data) => {
      setVendas(data.vendas || []);
      setSumario(data.sumario || null);
    },
    onError: () => {
      toast.error('Erro ao carregar relatório.');
    },
  });

  const formatDateBR = (date: any) => {
    if (!date) return '-';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  React.useEffect(() => {
    mutation.mutate(filters);
  }, [filters]);

  function handleExportPdf() {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      doc.setFontSize(16);
      doc.text('Relatório - Fechamento de Caixa', 40, 50);

      doc.setFontSize(11);
      const summaryY = 70;
      const marginLeft = 40;
      const marginRight = 40;
      const pageWidth = typeof doc.internal.pageSize.getWidth === 'function' ? doc.internal.pageSize.getWidth() : (doc.internal.pageSize.width || 595.28);
      doc.text(`Período: ${formatDateBR(filters?.periodo?.dataInicial)} até ${formatDateBR(filters?.periodo?.dataFinal)}`,  marginLeft, summaryY);

      const availableWidth = pageWidth - marginLeft - marginRight;
      const colWidth = availableWidth / 3;
      const colY = summaryY + 20;

      doc.text('Valor Total Bruto', marginLeft, colY);
      doc.text('Valor Total Líquido', marginLeft + colWidth, colY);
      doc.text('Valor Total de Descontos', marginLeft + colWidth * 2, colY);

      const valueY = colY + 14;
      doc.text(`R$ ${sumario ? Number(sumario.totalBruto).toFixed(2) : '0.00'}`, marginLeft, valueY);
      doc.text(`R$ ${sumario ? Number(sumario.totalLiquido).toFixed(2) : '0.00'}`, marginLeft + colWidth, valueY);
      doc.text(`R$ ${sumario ? Number(sumario.descontos).toFixed(2) : '0.00'}`, marginLeft + colWidth * 2, valueY);

      const columns = ['Data', 'Produtos', 'Quantidade', 'Valor', 'Desconto', 'Pagamento'];
      const rows: any[] = (vendas || []).map((v: any) => {
        const produtosText = (v.produtos || []).map((p: any) => p.produto?.descricao).join(', ');
        const quantidade = (v.produtos || []).reduce((s: number, p: any) => s + (p.quantidade || 0), 0);
        const valor = Number(v.valorTotalVenda || 0).toFixed(2);
        const desconto = Number(v.valorTotalDesconto || 0).toFixed(2);
        const pagamento = v.formaPagamento?.name || '-';
        return [new Date(v.createdAt).toLocaleString(), produtosText, String(quantidade), `R$ ${valor}`, `R$ ${desconto}`, pagamento];
      });

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: valueY + 20,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [40, 116, 240] },
        margin: { left: marginLeft, right: marginRight },
      });

      doc.save('relatorio_fechamento.pdf');
    } catch (err) {
      toast.error('Erro ao gerar PDF.');
    }
  }

  return (
    <div className='min-h-full flex flex-col gap-6'>
      <h1 className='text-2xl font-semibold'>Relatório - Fechamento de Caixa</h1>

      <main className='flex-1 flex flex-col gap-6'>
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Vendas</CardTitle>
            </CardHeader>

            <CardContent className='p-0'>
              <div className='max-h-[60vh] overflow-y-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Produtos</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Desconto</TableHead>
                      <TableHead>Pagamento</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {(vendas || []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5}>Nenhuma venda encontrada para o filtro.</TableCell>
                      </TableRow>
                    )}
                    {(vendas || []).map((v) => (
                      <TableRow key={v.id}>
                        <TableCell>{new Date(v.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{(v.produtos || []).map((p: any) => p.produto?.descricao).join(', ')}</TableCell>
                        <TableCell>{(v.produtos || []).reduce((s: number, p: any) => s + (p.quantidade || 0), 0)}</TableCell>
                        <TableCell>{`R$ ${Number(v.valorTotalVenda || 0).toFixed(2)}`}</TableCell>
                        <TableCell>{`R$ ${Number(v.valorTotalDesconto || 0).toFixed(2)}`}</TableCell>
                        <TableCell>{v.formaPagamento?.name || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Valores Gerais</CardTitle>
            </CardHeader>

            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex gap-4 '>
                    <strong>Valor Total Bruto: </strong><span>{sumario ? `R$ ${Number(sumario.totalBruto).toFixed(2)}` : '-'}</span>
                </div>

                <div className='flex gap-4 '>
                    <strong>Valor Total Líquido: </strong><span>{sumario ? `R$ ${Number(sumario.totalLiquido).toFixed(2)}` : '-'}</span>
                </div>

                <div className='flex gap-4 '>
                    <strong>Valor Total de Descontos: </strong><span>{sumario ? `R$ ${Number(sumario.descontos).toFixed(2)}` : '-'}</span>
                </div>

                <div className='flex gap-4 '>
                    <strong>Produto Mais Vendido: </strong><span>{sumario?.produtoMaisVendido?.nome || '-'}</span>
                </div>

                <div className='flex gap-4 '>
                    <strong>Pagamento Mais Usado: </strong><span>{sumario?.formaPagamentoMaisUsada?.nome || '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer>
        <div className='flex justify-center gap-3'>
          <Button className='cursor-pointer' variant='outline' onClick={() => navigate(-1)}>Voltar</Button>
          <Button className='cursor-pointer' onClick={handleExportPdf}>Exportar PDF</Button>
        </div>
      </footer>
    </div>
  );
}
