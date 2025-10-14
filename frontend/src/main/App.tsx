import { Route, Routes } from 'react-router';
import { Login } from '../pages/Login/Login';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { MainLayout } from '@/components/MainLayout';
import ListarProdutos from '@/pages/Produto/ListarProduto';
import ListarUsuarios from '@/pages/Usuario/ListarUsuario';
import FormasPagamento from '@/pages/FormasPagamento/FormasPagamento';
import CategoriasPage from '@/app/categoria/page';
import { EsqSenha } from '@/pages/Login/EsqSenha';

function App() {
  return (
    <Routes>
      <Route
        path='/login'
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path='/esq-senha'
        element={
          <PublicRoute>
            <EsqSenha />
          </PublicRoute>
        }
      />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Dashboard />}
        />
        <Route
          path='usuarios'
          element={<ListarUsuarios />}
        />
        <Route
          path='formas-pagamento'
          element={<FormasPagamento />}
        />
        <Route
          path='categorias'
          element={<CategoriasPage />}
        />
        <Route
          path='produtos'
          element={<ListarProdutos />}
        />
      </Route>

      <Route
        path='/'
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
    </Routes>
  );
}

export default App;
