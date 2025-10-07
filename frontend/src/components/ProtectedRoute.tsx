import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authUtils } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!authUtils.isAuthenticated()) {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  return <>{children}</>;
}
