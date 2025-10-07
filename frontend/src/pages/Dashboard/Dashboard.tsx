import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, DollarSign, Package, AlertTriangle, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authUtils } from '@/lib/auth';

export function Dashboard() {
  const user = authUtils.getUser();

  const stats = [
    {
      title: 'Vendas Hoje',
      value: 'R$ 847,50',
      description: '+18% em relação a ontem',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pedidos do Dia',
      value: '124',
      description: '23 pedidos na última hora',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Produtos em Falta',
      value: '3',
      description: 'Pão de açúcar, Refrigerante, Salgado',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Funcionários Online',
      value: '8',
      description: '2 caixas, 4 cozinha, 2 limpeza',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/usuarios',
    },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Bem-vindo, {user?.nome || 'Usuário'}!</h1>
        <p className='mt-2 text-gray-600'>
          Aqui está um resumo do que está acontecendo na cantina hoje.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map(stat => {
          const Icon = stat.icon;
          const CardComponent = stat.href
            ? ({ children, ...props }: React.ComponentProps<typeof Card>) => (
                <Link to={stat.href}>
                  <Card
                    {...props}
                    className='cursor-pointer transition-shadow hover:shadow-md'
                  >
                    {children}
                  </Card>
                </Link>
              )
            : Card;

          return (
            <CardComponent key={stat.title}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor || 'bg-gray-50'}`}>
                  <Icon className={`h-4 w-4 ${stat.color || 'text-gray-600'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stat.value}</div>
                <p className='text-muted-foreground text-xs'>{stat.description}</p>
              </CardContent>
            </CardComponent>
          );
        })}
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Top 5 produtos do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Salgado de Frango</span>
                <span className='text-sm text-gray-500'>47 unidades</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Refrigerante</span>
                <span className='text-sm text-gray-500'>38 unidades</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Café Expresso</span>
                <span className='text-sm text-gray-500'>32 unidades</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Pão de Açúcar</span>
                <span className='text-sm text-gray-500'>28 unidades</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Suco Natural</span>
                <span className='text-sm text-gray-500'>21 unidades</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse as funcionalidades mais utilizadas</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <Link
              to='/usuarios'
              className='flex items-center rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100'
            >
              <Users className='mr-3 h-5 w-5 text-blue-600' />
              <div>
                <div className='font-medium text-blue-900'>Gerenciar Funcionários</div>
                <div className='text-sm text-blue-600'>
                  Adicionar, editar funcionários da cantina
                </div>
              </div>
            </Link>

            <div className='flex items-center rounded-lg bg-green-50 p-3'>
              <Coffee className='mr-3 h-5 w-5 text-green-600' />
              <div>
                <div className='font-medium text-green-900'>Cardápio</div>
                <div className='text-sm text-green-600'>Gerenciar produtos e preços</div>
              </div>
            </div>

            <div className='flex items-center rounded-lg bg-orange-50 p-3'>
              <Package className='mr-3 h-5 w-5 text-orange-600' />
              <div>
                <div className='font-medium text-orange-900'>Estoque</div>
                <div className='text-sm text-orange-600'>Controlar produtos em estoque</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas movimentações da cantina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-start'>
                <div className='mt-1 mr-3 h-2 w-2 rounded-full bg-green-500'></div>
                <div className='text-sm'>
                  <span className='font-medium'>Venda: 15x Salgado de Frango</span>
                  <div className='text-gray-500'>R$ 45,00 • há 12 minutos</div>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='mt-1 mr-3 h-2 w-2 rounded-full bg-blue-500'></div>
                <div className='text-sm'>
                  <span className='font-medium'>Funcionário: Maria Silva fez login</span>
                  <div className='text-gray-500'>Caixa 2 • há 1 hora</div>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='mt-1 mr-3 h-2 w-2 rounded-full bg-red-500'></div>
                <div className='text-sm'>
                  <span className='font-medium'>Alerta: Refrigerante Coca-Cola em falta</span>
                  <div className='text-gray-500'>Estoque zerado • há 2 horas</div>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='mt-1 mr-3 h-2 w-2 rounded-full bg-orange-500'></div>
                <div className='text-sm'>
                  <span className='font-medium'>Reposição: 50 unidades de Pão de Açúcar</span>
                  <div className='text-gray-500'>Fornecedor ABC • há 3 horas</div>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='mt-1 mr-3 h-2 w-2 rounded-full bg-purple-500'></div>
                <div className='text-sm'>
                  <span className='font-medium'>Cardápio: Novo item adicionado</span>
                  <div className='text-gray-500'>Suco Natural de Laranja • ontem</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
