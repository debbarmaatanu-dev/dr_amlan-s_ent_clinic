import {GoogleAuthProvider, signInWithPopup, type User} from 'firebase/auth';
import type {Dispatch, MouseEvent, SetStateAction} from 'react';
import {auth} from './firebase';

/**
 * Handle admin Google login.
 *
 * @param {MouseEvent<HTMLButtonElement>} e - Event triggered on clicking the Google login button
 * @param {string[]} allowedAdminEmails - Array of registered admin email addresses
 * @param {Dispatch<SetStateAction<string | null>>} setError - Function to set error message
 * @param {Dispatch<SetStateAction<boolean>>} setLoading - Function to set loading state
 * @param {Dispatch<SetStateAction<boolean>>} setSuccess - Function to set success state
 * @param {Dispatch<SetStateAction<string>>} setSuccessMessage - Function to set success message
 * @param {(user: User | null) => void} setAdmin - Function to set admin user
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
      setError('❌ Error fetching data!');
      setSuccessMessage('');
      return;
    }

    const userEmail = result.user.email;

    if (!userEmail || !allowedAdminEmails.includes(userEmail)) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setError('❌ Google login failed: ' + (error as any).message);
  }
};
