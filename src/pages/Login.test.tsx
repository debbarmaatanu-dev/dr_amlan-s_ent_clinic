import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {act, render, screen} from '@testing-library/react';
import type {Dispatch, SetStateAction} from 'react';
import {Login} from './Login';

type FormProps = {
  setLoading: Dispatch<SetStateAction<boolean>>;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  setSuccessMessage: Dispatch<SetStateAction<string>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
};

let formProps: FormProps | null = null;

jest.mock('@/components/AdminLoginForm', () => ({
  __esModule: true,
  default: (props: FormProps) => {
    formProps = props;
    return <div>Admin form</div>;
  },
}));

jest.mock('@/appComponents/LoadingModal', () => ({
  LoadingModal: ({
    loading,
    error,
    errorMessage,
  }: {
    loading: boolean;
    error?: boolean;
    errorMessage?: string;
  }) => (
    <div role="dialog">
      {loading ? 'Loading' : null}
      {error ? errorMessage : null}
    </div>
  ),
}));

async function failLoginWith(message: string) {
  if (!formProps) {
    throw new Error('AdminLoginForm props not captured');
  }
  await act(async () => {
    formProps!.setLoading(true);
    formProps!.setError(null);
  });
  await act(async () => {
    formProps!.setError(message);
    formProps!.setLoading(false);
  });
}

describe('Login error modal', () => {
  beforeEach(() => {
    formProps = null;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the error modal again after dismiss when the same error repeats', async () => {
    render(<Login />);

    await failLoginWith('Access denied');
    expect(screen.getByRole('dialog')).toHaveTextContent('Access denied');

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await failLoginWith('Access denied');
    expect(screen.getByRole('dialog')).toHaveTextContent('Access denied');

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
