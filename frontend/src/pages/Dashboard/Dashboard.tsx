import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useEffect, useState } from 'react';
import { dashboardApi } from '@/api/dashboard';
import type {
    ResumoFinanceiro,
    ProdutoMaisVendido,
    VendaPorFormaPagamento,
    ItemEstoque,
} from '@/api/dashboard';

const COLORS = ['#FCD34D', '#A78BFA', '#EC4899'];

export function Dashboard() {
    const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
    const [produtosMaisVendidos, setProdutosMaisVendidos] = useState<ProdutoMaisVendido[]>([]);
    const [vendasPorFormaPagamento, setVendasPorFormaPagamento] = useState<
        VendaPorFormaPagamento[]
    >([]);
    const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resumoData, produtosData, vendasData, estoqueData] = await Promise.all([
                    dashboardApi.getResumoFinanceiro('hoje'),
                    dashboardApi.getProdutosMaisVendidos(5),
                    dashboardApi.getVendasPorFormaPagamento(),
                    dashboardApi.getControleEstoque(),
                ]);

                setResumo(resumoData);
                setProdutosMaisVendidos(produtosData);
                setVendasPorFormaPagamento(vendasData);
                setEstoque(estoqueData);
            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className='space-y-6 p-6'>
            <div>
                <h1 className='text-3xl font-bold text-gray-900'>Catina Unimater</h1>
                <p className='mt-2 text-gray-600'>
                    Aqui está um resumo do que está acontecendo na cantina hoje.
                </p>
            </div>

            <div className='grid gap-6 md:grid-cols-3'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total de Receitas</CardTitle>
                        <div className='rounded-lg bg-green-50 p-2'>
                            <TrendingUp className='h-4 w-4 text-green-600' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            ${resumo?.totalReceitas.toFixed(2) || '0.00'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total de Despesas</CardTitle>
                        <div className='rounded-lg bg-red-50 p-2'>
                            <TrendingDown className='h-4 w-4 text-red-600' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>
                            ${resumo?.totalDespesas.toFixed(2) || '0.00'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Saldo</CardTitle>
                        <div className='rounded-lg bg-blue-50 p-2'>
                            <Wallet className='h-4 w-4 text-blue-600' />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>${resumo?.saldo.toFixed(2) || '0.00'}</div>
                    </CardContent>
                </Card>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Produtos mais vendidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width='100%' height={300}>
                      <BarChart data={produtosMaisVendidos}>
                        <XAxis dataKey='produto' tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey='quantidade' fill='#60A5FA' radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Formas de pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-4 flex items-center justify-center gap-6'>
                      {vendasPorFormaPagamento.map((item, index) => (
                        <div key={item.formaPagamento} className='flex items-center gap-2'>
                          <div
                            className='h-3 w-3 rounded-full'
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className='text-sm text-gray-600'>{item.formaPagamento}</span>
                        </div>
                      ))}
                    </div>
                    <ResponsiveContainer width='100%' height={260}>
                      <PieChart>
                        <Pie
                          data={vendasPorFormaPagamento as any}
                          cx='50%'
                          cy='50%'
                          innerRadius={70}
                          outerRadius={100}
                          fill='#8884d8'
                          paddingAngle={2}
                          dataKey='percentual'
                          nameKey='formaPagamento'
                        >
                          {vendasPorFormaPagamento.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr className='border-b'>
                        <th className='py-3 text-left font-semibold'>Produto</th>
                        <th className='py-3 text-center font-semibold'>Quantidade</th>
                        <th className='py-3 text-center font-semibold'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estoque.slice(0, 5).map((item) => (
                        <tr key={item.id} className='border-b'>
                          <td className='py-3'>{item.produto}</td>
                          <td className='py-3 text-center'>{item.quantidade}</td>
                          <td className='py-3 px-2'>
                            <div
                              className={`rounded-md py-2 text-center text-sm font-medium text-white ${
                                item.status === 'Esgotado'
                                  ? 'bg-red-500'
                                  : item.status === 'Baixo estoque'
                                    ? 'bg-orange-500'
                                    : 'bg-green-600'
                              }`}
                            >
                              {item.status}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className='mt-4 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>Rows per page</span>
                      <select className='rounded border px-2 py-1 text-sm'>
                        <option>5</option>
                        <option>10</option>
                        <option>20</option>
                      </select>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>Page 1 of 2</span>
                      <div className='flex gap-1'>
                        <button className='rounded border px-2 py-1 text-sm hover:bg-gray-100'>
                          «
                        </button>
                        <button className='rounded border px-2 py-1 text-sm hover:bg-gray-100'>
                          ‹
                        </button>
                        <button className='rounded border px-2 py-1 text-sm hover:bg-gray-100'>
                          ›
                        </button>
                        <button className='rounded border px-2 py-1 text-sm hover:bg-gray-100'>
                          »
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
    );
}
