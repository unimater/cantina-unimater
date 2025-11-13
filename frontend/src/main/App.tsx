import { Route, Routes } from 'react-router';
import { Login } from '../pages/Login/Login';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { MainLayout } from '@/components/MainLayout';
import ListarProdutos from '@/pages/Produto/ListarProduto';
import ListarUsuarios from '@/pages/Usuario/ListarUsuario';
import ListarDespesas from '@/pages/Despesas/ListarDespesas';
import ListarPedido from '@/pages/Pedidos/ListarPedidos';  // ✔ CORRETO
import FormasPagamento from '@/pages/FormasPagamento/FormasPagamento';
import CategoriasPage from '@/app/categoria/page';
import { EsqSenha } from '@/pages/Login/EsqSenha';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />

      <Routes>

        {/* 🔓 Rotas Públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/esq-senha"
          element={
            <PublicRoute>
              <EsqSenha />
            </PublicRoute>
          }
        />

        {/* 🔐 Rotas Protegidas com Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="usuarios" element={<ListarUsuarios />} />
          <Route path="despesas" element={<ListarDespesas />} />
          <Route path="formas-pagamento" element={<FormasPagamento />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="produtos" element={<ListarProdutos />} />

          {/* ✔ ROTA CORRIGIDA PARA PEDIDOS */}
          <Route path="pedidos" element={<ListarPedido />} />
        </Route>

        {/* Redirecionamento para login */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
