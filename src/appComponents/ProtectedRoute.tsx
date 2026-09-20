import type {ReactNode} from 'react';
import {useAppStore} from '../appStore/appStore';
import {Navigate} from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({children}: ProtectedRouteProps) => {
  const user = useAppStore(state => state.user);

  if (user) {
    return <Navigate to={'/home'} replace />;
  }

  return children;
};
