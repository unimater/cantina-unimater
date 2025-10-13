import { Route, Routes } from 'react-router';
import { Login } from '../pages/Login/Login';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { MainLayout } from '@/components/MainLayout';
import ListarUsuarios from '@/pages/Usuario/ListarUsuario';
import CategoriasPage from '@/app/categoria/page';

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
          element={<ListarUsuarios />}
        />
        <Route
          path='categorias'
          element={<CategoriasPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
