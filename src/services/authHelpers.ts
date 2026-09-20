import type {User} from 'firebase/auth';

/**
 * Admin allowlist from Vite env (client-side UX only; backend still enforces).
 */
export function getConfiguredAdminEmails(): string[] {
  return [
    import.meta.env.VITE_FIREBASE_ADMIN_EMAIL1,
    import.meta.env.VITE_FIREBASE_ADMIN_EMAIL2,
  ].filter(
    (email): email is string => typeof email === 'string' && email.length > 0,
  );
}

export function isAllowedAdminEmail(
  email: string | null | undefined,
  allowedEmails: string[] = getConfiguredAdminEmails(),
): boolean {
  return !!email && allowedEmails.includes(email);
}

/**
 * Returns the user only when their email is on the admin allowlist.
 */
export function resolveAdminUser(
  user: User | null,
  allowedEmails: string[] = getConfiguredAdminEmails(),
): User | null {
  if (!user || !isAllowedAdminEmail(user.email, allowedEmails)) {
    return null;
  }
  return user;
}
