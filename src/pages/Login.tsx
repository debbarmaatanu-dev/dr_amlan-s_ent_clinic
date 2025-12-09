import {LoadingModal} from '@/appComponents/LoadingModal';
import AdminLoginForm from '@/components/AdminLoginForm';
import React, {useEffect, useState} from 'react';

export const Login = (): React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Auto-dismiss error modal after 2 seconds
  useEffect(() => {
    if (error && !loading && !success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowModal(true);
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (loading || success) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [error, loading, success]);

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
