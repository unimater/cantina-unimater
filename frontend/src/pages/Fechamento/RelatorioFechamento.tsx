import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

export default function RelatorioFechamento() {
  const location = useLocation();
  const navigate = useNavigate();
  const filters = (location.state as any)?.filters || {};

  const [vendas, setVendas] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState<any>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const response = await api.post('/venda/relatorio', filters);
        setVendas(Array.isArray(response.data.vendas) ? response.data.vendas : (response.data.vendas || []));
        setSummary(response.data.summary || null);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar relatório.');
      }
    }
    load();
  }, [filters]);

  function handleExportPdf() {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      doc.setFontSize(16);
      doc.text('Relatório - Fechamento de Caixa', 40, 50);

      doc.setFontSize(11);
      const summaryY = 70;
      doc.text(`Período: ${filters?.periodo?.startDate || '-'} até ${filters?.periodo?.endDate || '-'}`, 40, summaryY);
      doc.text(`Valor Total: R$ ${summary ? Number(summary.total).toFixed(2) : '0.00'}`, 40, summaryY + 20);

      const columns = ['Data', 'Produtos', 'Quantidade', 'Valor', 'Pagamento'];
      const rows: any[] = (vendas || []).map((v: any) => {
        const produtosText = (v.produtos || []).map((p: any) => p.produto?.descricao || p.produto?.nome || '-').join(', ');
        const quantidade = (v.produtos || []).reduce((s: number, p: any) => s + (p.quantidade || 0), 0);
        const valor = Number(v.total || 0).toFixed(2);
        const pagamento = v.formaPagamento?.name || v.formaPagamento?.nome || '-';
        return [new Date(v.createdAt).toLocaleString(), produtosText, String(quantidade), `R$ ${valor}`, pagamento];
      });

      autoTable(doc as any, {
        head: [columns],
        body: rows,
        startY: summaryY + 50,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [40, 116, 240] },
        margin: { left: 40, right: 40 },
      });

      doc.save('relatorio_fechamento.pdf');
    } catch (err) {
      console.error(err);
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
                        <TableCell>{new Date(v.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{(v.produtos || []).map((p: any) => p.produto?.descricao || p.produto?.nome).join(', ')}</TableCell>
                        <TableCell>{(v.produtos || []).reduce((s: number, p: any) => s + (p.quantidade || 0), 0)}</TableCell>
                        <TableCell>{`R$ ${Number(v.total || 0).toFixed(2)}`}</TableCell>
                        <TableCell>{v.formaPagamento?.name || v.formaPagamento?.nome || '-'}</TableCell>
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
                <div className='flex gap-4'>
                    <strong>Valor Total: </strong><span>{summary ? `R$ ${Number(summary.total).toFixed(2)}` : '-'}</span>
                </div>
                <div className='flex gap-4'>
                    <strong>Produto Mais Vendido: </strong><span>{summary?.mostSold?.nome || '-'}</span>
                </div>
                <div className='flex gap-4'>
                    <strong>Pagamento Mais Usado: </strong><span>{summary?.mostUsedPayment?.nome || '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className='py-6'>
        <div className='flex justify-center gap-3'>
          <Button variant='ghost' onClick={() => navigate(-1)}>Voltar</Button>
          <Button onClick={handleExportPdf}>Exportar PDF</Button>
        </div>
      </footer>
    </div>
  );
}
