import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import type {MouseEvent} from 'react';
import type {User as FirebaseUser} from 'firebase/auth';
import {handleAdminGoogleLogin} from './googleLoginHelper';

const mockSignInWithPopup = jest.fn();

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
}));

jest.mock('./firebase', () => ({
  auth: {currentUser: null},
}));

describe('handleAdminGoogleLogin', () => {
  const setError = jest.fn();
  const setLoading = jest.fn();
  const setSuccess = jest.fn();
  const setSuccessMessage = jest.fn();
  const setAdmin = jest.fn();
  const scrollTo = jest.fn();

  const event = {
    preventDefault: jest.fn(),
  } as unknown as MouseEvent<HTMLButtonElement>;

  beforeEach(() => {
    jest.useFakeTimers();
    mockSignInWithPopup.mockReset();
    setError.mockReset();
    setLoading.mockReset();
    setSuccess.mockReset();
    setSuccessMessage.mockReset();
    setAdmin.mockReset();
    scrollTo.mockReset();
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('rejects non-admin emails and clears loading', async () => {
    mockSignInWithPopup.mockResolvedValue({
      user: {email: 'random@test.com'} as FirebaseUser,
    });

    await handleAdminGoogleLogin(
      event,
      ['admin1@test.com'],
      setError,
      setLoading,
      setSuccess,
      setSuccessMessage,
      setAdmin,
    );

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(setError).toHaveBeenCalledWith('❌ Not a registered admin!');
    expect(setAdmin).not.toHaveBeenCalled();
  });

  it('accepts allowlisted admins after the success delay', async () => {
    const user = {email: 'admin1@test.com'} as FirebaseUser;
    mockSignInWithPopup.mockResolvedValue({user});

    await handleAdminGoogleLogin(
      event,
      ['admin1@test.com'],
      setError,
      setLoading,
      setSuccess,
      setSuccessMessage,
      setAdmin,
    );

    expect(setSuccess).toHaveBeenCalledWith(true);
    expect(setSuccessMessage).toHaveBeenCalledWith('✅ Login successful!');
    expect(setAdmin).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    expect(setAdmin).toHaveBeenCalledWith(user);
    expect(setError).toHaveBeenCalledWith(null);
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('surfaces Google popup failures', async () => {
    mockSignInWithPopup.mockRejectedValue(new Error('popup closed'));

    await handleAdminGoogleLogin(
      event,
      ['admin1@test.com'],
      setError,
      setLoading,
      setSuccess,
      setSuccessMessage,
      setAdmin,
    );

    expect(setLoading).toHaveBeenCalledWith(false);
    expect(setError).toHaveBeenCalledWith(
      '❌ Google login failed: popup closed',
    );
  });
});
