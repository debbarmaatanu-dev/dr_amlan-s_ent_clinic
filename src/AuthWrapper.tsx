import {auth} from '@/services/firebase';
import React from 'react';
import {type ReactNode, useEffect, useState} from 'react';
import {ClipLoader} from 'react-spinners';
import {appStore} from './appStore/appStore';
import {onIdTokenChanged, type User} from 'firebase/auth';

export const AuthWrapper = ({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element => {
  const [loading, setLoading] = useState(true);
  const setUser = appStore(state => state.setUser);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user: User | null) => {
      if (user) {
        // Check if user is admin (frontend check for UI only)
        const adminEmails = [
          import.meta.env.VITE_FIREBASE_ADMIN_EMAIL1,
          import.meta.env.VITE_FIREBASE_ADMIN_EMAIL2,
        ];

        if (adminEmails.includes(user.email || '')) {
          setUser(user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  if (loading)
    return (
      <div className="flex h-[screen] w-[screen] flex-col items-center justify-center">
        <ClipLoader size={30} color="#1a3bdf" />
      </div>
    );

  return <>{children}</>;
};
