import { Route, Routes } from 'react-router';
import { Login } from '../pages/Login/Login';
import UsuariosPage from '@/app/usuario/page';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { MainLayout } from '@/components/MainLayout';
import ListarProdutos from '@/pages/Produto/ListarProduto';

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
          element={<UsuariosPage />}
        />
        <Route
          path='produtos'
          element={<ListarProdutos />}
        />
      </Route>
    </Routes>
  );
}

export default App;
