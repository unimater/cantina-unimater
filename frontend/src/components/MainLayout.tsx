import { type ReactNode } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, LogOut, Shapes, Boxes, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { authUtils } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authUtils.getUser();

  const handleLogout = () => {
    authUtils.removeUser();
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      current: location.pathname === '/',
    },
    {
      name: 'Usuários',
      href: '/usuarios',
      icon: Users,
      current: location.pathname === '/usuarios',
    },
    {
      name: 'Formas de Pagamento',
      href: '/formas-pagamento',
      icon: CreditCard,
      current: location.pathname === '/formas-pagamento',
    },
    {
      name: 'Categorias',
      href: '/categorias',
      icon: Shapes,
      current: location.pathname === '/categorias',
    },
    {
      name: 'Produtos',
      href: '/produtos',
      icon: Boxes,
      current: location.pathname === '/produtos',
    },
  ];

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className='flex w-64 flex-col bg-white shadow-lg'>
        {/* Header */}
        <div className='flex h-16 items-center justify-center bg-blue-600 px-4 text-white'>
          <h1 className='text-xl font-bold'>Cantina Unimater</h1>
        </div>

        {/* User Info */}
        <div className='px-4 py-4'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white'>
                {user?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-700'>{user?.nome || 'Usuário'}</p>
              <p className='text-xs text-gray-500'>{user?.email}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <nav className='flex-1 space-y-2 px-4 py-4'>
          {navigation.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  item.current
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className='mr-3 h-5 w-5' />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className='px-4 py-4'>
          <Separator className='mb-4' />
          <Button
            onClick={handleLogout}
            variant='ghost'
            className='w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700'
          >
            <LogOut className='mr-3 h-5 w-5' />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Top bar */}
        <header className='border-b bg-white shadow-sm'>
          <div className='px-6 py-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-800'>
                {navigation.find(item => item.current)?.name || 'Dashboard'}
              </h2>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className='flex-1 overflow-auto p-6'>{children || <Outlet />}</main>
      </div>
    </div>
  );
}
