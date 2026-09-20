import {auth} from './firebase';

/**
 * Build Authorization headers from the current Firebase user.
 * Returns null when no user is signed in.
 */
export async function getBearerAuthHeaders(): Promise<Record<
  string,
  string
> | null> {
  const user = auth.currentUser;
  if (!user) return null;

  const token = await user.getIdToken(true);
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}
