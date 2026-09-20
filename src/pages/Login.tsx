import {LoadingModal} from '@/appComponents/LoadingModal';
import AdminLoginForm from '@/components/AdminLoginForm';
import React, {useEffect, useState} from 'react';

export const Login = (): React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [errorCycle, setErrorCycle] = useState(0);
  const [dismissedCycle, setDismissedCycle] = useState<number | null>(null);
  const [wasLoading, setWasLoading] = useState(false);

  // Each new login attempt (loading rising edge) starts a fresh modal cycle so
  // the same error text can show the overlay again after auto-dismiss.
  if (loading && !wasLoading) {
    setWasLoading(true);
    setErrorCycle(cycle => cycle + 1);
  } else if (!loading && wasLoading) {
    setWasLoading(false);
  }

  // Auto-dismiss error modal after 2 seconds (matches origin/main).
  useEffect(() => {
    if (!error || loading || success) {
      return;
    }
    const cycle = errorCycle;
    const timer = setTimeout(() => {
      setDismissedCycle(cycle);
    }, 2000);
    return () => clearTimeout(timer);
  }, [error, loading, success, errorCycle]);

  const showModal = Boolean(
    loading || success || (error !== null && dismissedCycle !== errorCycle),
  );

  return (
    <div className="h-full w-full">
      <AdminLoginForm
        setLoading={setLoading}
        setSuccess={setSuccess}
        setSuccessMessage={setSuccessMessage}
        error={error}
        setError={setError}
      />
      {showModal && (
        <LoadingModal
          loading={loading}
          success={success}
          successMessage={successMessage}
          error={!!error}
          errorMessage={error || ''}
        />
      )}
    </div>
  );
};
