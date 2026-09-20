import {auth} from '@/services/firebase';
import React, {type ReactNode, useEffect} from 'react';
import {useAppStore} from './appStore/appStore';
import {onIdTokenChanged, type User} from 'firebase/auth';
import {resolveAdminUser} from '@/services/authHelpers';

export const AuthWrapper = ({
  children,
}: {
  children: ReactNode;
}): React.ReactNode => {
  const setUser = useAppStore(state => state.setUser);
  const setAuthInitialized = useAppStore(state => state.setAuthInitialized);
  const initializeTheme = useAppStore(state => state.initializeTheme);

  // Initialize theme from cookie on app load (synchronous)
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Initialize auth state asynchronously in background (non-blocking)
  useEffect(() => {
    // Check if there's already a current user (for existing sessions)
    const checkCurrentUser = async () => {
      setUser(resolveAdminUser(auth.currentUser));
    };

    // Check immediately for existing user
    void checkCurrentUser();

    // Set up listener for auth state changes
    const unsubscribe = onIdTokenChanged(auth, async (user: User | null) => {
      setUser(resolveAdminUser(user));
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setAuthInitialized]);

  // Render immediately without waiting for auth check
  return children;
};
