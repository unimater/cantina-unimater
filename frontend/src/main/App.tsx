import { Route, Routes, Navigate } from 'react-router';
import { Login } from '../pages/Login/Login';
import UsuariosPage from '@/app/usuario/page';
import { PublicRoute } from '@/components/PublicRoute';
import { ProtectedRoute } from '@/components/ProtectedRoute';

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
        path='/usuarios'
        element={
          <ProtectedRoute>
            <UsuariosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/'
        element={
          <Navigate
            to='/usuarios'
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
