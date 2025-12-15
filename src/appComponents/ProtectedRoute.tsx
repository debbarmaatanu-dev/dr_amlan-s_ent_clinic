import type {ReactNode} from 'react';
import {appStore} from '../appStore/appStore';
import {Navigate} from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({children}: ProtectedRouteProps) => {
  const user = appStore(state => state.user);

  if (user) {
    return <Navigate to={'/home'} replace />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <React.Fragment>{children}</React.Fragment>;
};
