import type {ReactNode} from 'react';
import {appStore} from '../appStore/appStore';
import {Navigate} from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({children}: ProtectedRouteProps) => {
  const user = appStore(state => state.user);

  if (user) {
    return <Navigate to={'/home'} replace />;
  }

  return <>{children}</>;
};
