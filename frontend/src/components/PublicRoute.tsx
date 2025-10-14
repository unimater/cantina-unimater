import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authUtils } from '@/lib/auth';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function PublicRoute({ children, redirectTo = '/usuarios' }: PublicRouteProps) {
  if (authUtils.isAuthenticated()) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return <>{children}</>;
}
