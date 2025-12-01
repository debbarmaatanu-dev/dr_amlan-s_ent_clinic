import {ClipLoader} from 'react-spinners';

type LoadingModalProps = {
  loading: boolean;
  loadingMessage?: string;
  success: boolean;
  successMessage?: string;
  error?: boolean;
  errorMessage?: string;
};

export const LoadingModal = ({
  loading,
  loadingMessage,
  success,
  successMessage,
  error,
  errorMessage,
}: LoadingModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-fadeIn mx-4 w-full max-w-md transform rounded-2xl bg-white p-8 shadow-2xl transition-all">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <ClipLoader size={40} color="#3B82F6" loading={loading} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {loadingMessage || 'Loading'}
              </h2>
            </div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {successMessage || 'Success'}
              </h2>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-12 w-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {errorMessage || 'Error'}
              </h2>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
