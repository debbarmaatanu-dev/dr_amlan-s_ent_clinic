import {describe, expect, it, jest} from '@jest/globals';
import {render, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import type {User} from 'firebase/auth';
import {ProtectedRoute} from './ProtectedRoute';

const mockState = {
  user: null as User | null,
};

jest.mock('../appStore/appStore', () => ({
  useAppStore: (selector: (state: typeof mockState) => unknown) =>
    selector(mockState),
}));

describe('ProtectedRoute', () => {
  it('renders children when no admin session exists', () => {
    mockState.user = null;

    render(
      <MemoryRouter initialEntries={['/admin-login']}>
        <Routes>
          <Route
            path="/admin-login"
            element={
              <ProtectedRoute>
                <div>Login form</div>
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login form')).toBeInTheDocument();
  });

  it('redirects authenticated admins to /home', () => {
    mockState.user = {email: 'admin1@test.com'} as User;

    render(
      <MemoryRouter initialEntries={['/admin-login']}>
        <Routes>
          <Route
            path="/admin-login"
            element={
              <ProtectedRoute>
                <div>Login form</div>
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Login form')).not.toBeInTheDocument();
  });
});
