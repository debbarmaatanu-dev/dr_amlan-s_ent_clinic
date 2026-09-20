import {GoogleAuthProvider, signInWithPopup, type User} from 'firebase/auth';
import type {Dispatch, MouseEvent, SetStateAction} from 'react';
import {auth} from './firebase';
import {isAllowedAdminEmail} from './authHelpers';

/**
 * Handle admin Google login.
 */
export const handleAdminGoogleLogin = async (
  e: MouseEvent<HTMLButtonElement>,
  allowedAdminEmails: string[],
  setError: Dispatch<SetStateAction<string | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setSuccess: Dispatch<SetStateAction<boolean>>,
  setSuccessMessage: Dispatch<SetStateAction<string>>,
  setAdmin: (user: User | null) => void,
) => {
  e.preventDefault();
  const provider = new GoogleAuthProvider();
  setLoading(true);

  try {
    const result = await signInWithPopup(auth, provider);

    if (!result) {
      setLoading(false);
      setError('❌ Error fetching data!');
      setSuccessMessage('');
      return;
    }

    const userEmail = result.user.email;

    if (!isAllowedAdminEmail(userEmail, allowedAdminEmails)) {
      setLoading(false);
      setError('❌ Not a registered admin!');
      setSuccessMessage('');
      return;
    }

    setLoading(false);
    setSuccess(true);
    setSuccessMessage('✅ Login successful!');

    setTimeout(() => {
      setSuccess(false);
      setSuccessMessage('');
      setAdmin(result.user);
      setError(null);
      window.scrollTo(0, 0);
    }, 2000);
  } catch (error: unknown) {
    setLoading(false);
    setError('❌ Google login failed: ' + (error as Error).message);
  }
};
