import {describe, expect, it} from '@jest/globals';
import type {User} from 'firebase/auth';
import {
  getConfiguredAdminEmails,
  isAllowedAdminEmail,
  resolveAdminUser,
} from './authHelpers';

describe('authHelpers', () => {
  it('reads configured admin emails from env', () => {
    expect(getConfiguredAdminEmails()).toEqual([
      'admin1@test.com',
      'admin2@test.com',
    ]);
  });

  it('checks allowlist membership', () => {
    expect(isAllowedAdminEmail('admin1@test.com')).toBe(true);
    expect(isAllowedAdminEmail('other@test.com')).toBe(false);
    expect(isAllowedAdminEmail(null)).toBe(false);
    expect(isAllowedAdminEmail(undefined, ['a@b.com'])).toBe(false);
  });

  it('resolves only allowlisted users as admins', () => {
    const admin = {email: 'admin2@test.com'} as User;
    const stranger = {email: 'nope@test.com'} as User;

    expect(resolveAdminUser(admin)?.email).toBe('admin2@test.com');
    expect(resolveAdminUser(stranger)).toBeNull();
    expect(resolveAdminUser(null)).toBeNull();
  });
});
