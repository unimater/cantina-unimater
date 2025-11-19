import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';

export default function RelatorioFechamentoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const filters = (location.state as any)?.filters || {};

  const [vendas, setVendas] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState<any>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const response = await api.post('/venda/relatorio', filters);
        setVendas(response.data.vendas || []);
        setSummary(response.data.summary || null);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao carregar relatório.');
      }
    }
    load();
  }, [filters]);

  async function handleEnviarEmail() {
    try {
      await api.post('/venda/relatorio/email', filters);
      toast.success('E-mail enviado com sucesso (simulado).');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar e-mail.');
    }
  }

  function handleExportPdf() {
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });

      const title = 'Relatório - Fechamento de Caixa';
      doc.setFontSize(16);
      doc.text(title, 40, 50);

      doc.setFontSize(11);
      const summaryY = 70;
      doc.text(`Período: ${filters?.periodo?.startDate || '-'} até ${filters?.periodo?.endDate || '-'}`, 40, summaryY);
      doc.text(`Valor Total: R$ ${summary ? Number(summary.total).toFixed(2) : '0.00'}`, 40, summaryY + 16);
      doc.text(`Produto Mais Vendido: ${summary?.mostSold?.nome || '-'}`, 40, summaryY + 32);
      doc.text(`Pagamento Mais Usado: ${summary?.mostUsedPayment?.nome || summary?.mostUsedPayment?.name || '-'}`, 40, summaryY + 48);

      const columns = ['Data', 'Produtos', 'Quantidade', 'Valor', 'Pagamento'];
      const rows: any[] = vendas.map((v: any) => {
        const produtosText = (v.produtos || []).map((p: any) => p.produto?.descricao || p.produto?.nome || '-').join(', ');
        const quantidade = (v.produtos || []).reduce((s: number, p: any) => s + (p.quantidade || 0), 0);
        const valor = Number(v.total || 0).toFixed(2);
        const pagamento = v.formaPagamento?.name || v.formaPagamento?.nome || '-';
        return [new Date(v.createdAt).toLocaleString(), produtosText, String(quantidade), `R$ ${valor}`, pagamento];
      });

      // @ts-ignore - plugin
      (doc as any).autoTable({
        head: [columns],
        body: rows,
        startY: summaryY + 70,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [40, 116, 240] },
        margin: { left: 40, right: 40 },
      });

      doc.save('relatorio_fechamento.pdf');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao gerar PDF. Veja o console para detalhes.');
    }
  }

  return (
    <div className='space-y-6 min-h-screen flex flex-col'>
      <div>
        <h1 className='text-2xl font-bold'>Relatório - Fechamento de Caixa</h1>
        <p className='text-sm text-gray-600'>Resumo das vendas geradas pelos filtros</p>
      </div>

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
                  <TableHead>Produto(s)</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendas.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{new Date(v.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{v.produtos?.map((p: any) => p.produto?.descricao).join(', ')}</TableCell>
                    <TableCell>{v.produtos?.reduce((s: number, p: any) => s + (p.quantidade || 0), 0)}</TableCell>
                    <TableCell>{`R$ ${Number(v.total || 0).toFixed(2)}`}</TableCell>
                    <TableCell>{v.formaPagamento?.name || v.formaPagamento?.nome}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valores Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between'><strong>Valor Total:</strong><span>{summary ? `R$ ${Number(summary.total).toFixed(2)}` : '-'}</span></div>
            <div className='flex justify-between'><strong>Produto Mais Vendido:</strong><span>{summary?.mostSold?.nome || '-'}</span></div>
            <div className='flex justify-between'><strong>Pagamento Mais Usado:</strong><span>{summary?.mostUsedPayment?.nome || '-'}</span></div>
          </div>
        </CardContent>
      </Card>

      <div className='mt-auto flex justify-center gap-3 py-6'>
        <Button onClick={() => navigate(-1)} variant='ghost'>Voltar</Button>
        <Button onClick={handleExportPdf}>Exportar PDF</Button>
        <Button onClick={handleEnviarEmail}>Enviar por E-mail</Button>
      </div>
    </div>
  );
}
