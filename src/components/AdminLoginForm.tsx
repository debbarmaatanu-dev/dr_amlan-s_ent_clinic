import {appStore} from '@/appStore/appStore';
import {handleAdminGoogleLogin} from '@/services/googleLoginHelper';
import {type MouseEvent} from 'react';
import {useTheme} from '@/hooks/useTheme';

import {IMAGES} from '@/constants/images';

const googleIcon = IMAGES.GOOGLE_ICON;

type AdminLoginFormProps = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function AdminLoginForm({
  setLoading,
  setSuccess,
  setSuccessMessage,
  error,
  setError,
}: AdminLoginFormProps): React.JSX.Element {
  const setAdmin = appStore(state => state.setUser);
  const {actualTheme} = useTheme();

  const allowedAdminEmails: string[] = [
    import.meta.env.VITE_FIREBASE_ADMIN_EMAIL1,
    import.meta.env.VITE_FIREBASE_ADMIN_EMAIL2,
  ];

  const handleGoogleLogin = (e: MouseEvent<HTMLButtonElement>) => {
    void handleAdminGoogleLogin(
      e,
      allowedAdminEmails,
      setError,
      setLoading,
      setSuccess,
      setSuccessMessage,
      setAdmin,
    );
  };

  const bgMain = actualTheme === 'light' ? 'bg-gray-100' : 'bg-gray-900';
  const bgCard =
    actualTheme === 'light'
      ? 'from-gray-50 to-gray-200'
      : 'from-gray-800 to-gray-900';
  const textColor = actualTheme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const textTertiary =
    actualTheme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const bgButton = actualTheme === 'light' ? 'bg-white' : 'bg-gray-700';

  return (
    <div
      className={`flex min-h-screen items-center justify-center ${bgMain} p-4`}>
      <div
        className={`w-full max-w-md rounded-lg bg-linear-to-br ${bgCard} p-10 shadow-2xl`}>
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 shadow-lg">
            <i className="fa-solid fa-shield-halved text-3xl text-white"></i>
          </div>
          <h1 className={`mb-2 text-4xl font-bold ${textColor}`}>
            ADMIN ACCESS
          </h1>
          <p className={`text-sm ${textSecondary}`}>
            Sign in with your authorized account
          </p>
        </div>

        {/* Error Message Banner */}
        {error && (
          <div className="animate-fadeIn mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <i className="fa-solid fa-circle-exclamation text-lg text-red-600"></i>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-sm font-semibold text-red-800">
                  Authentication Failed
                </h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="shrink-0 cursor-pointer text-red-400 transition-colors hover:text-red-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        )}

        {/* Google Login Button */}
        <button
          onClick={e => handleGoogleLogin(e)}
          className={`group relative w-full cursor-pointer overflow-hidden rounded-lg ${bgButton} py-4 font-semibold ${textSecondary} shadow-md transition-all duration-300 hover:shadow-xl active:scale-98`}>
          <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="relative flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
              <img
                src={googleIcon}
                alt="Google Icon"
                className="rounded-full"
                aria-label="Google Icon"
                loading="lazy"
              />
            </div>
            <span className="text-lg">Continue with Google</span>
          </div>
        </button>

        {/* Divider with subtle design */}
        <div className="my-8 flex items-center">
          <div
            className={`h-px flex-1 bg-linear-to-r from-transparent ${actualTheme === 'light' ? 'via-gray-300' : 'via-gray-600'} to-transparent`}></div>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <p className={`text-xs ${textTertiary}`}>
            <i className="fa-solid fa-lock mr-1"></i>
            Secure authentication powered by Google
          </p>
        </div>

        {/* Additional Security Badge */}
        <div
          className={`mt-6 flex items-center justify-center gap-2 text-xs ${textTertiary}`}>
          <i className="fa-solid fa-shield-check"></i>
          <span>Protected by enterprise security</span>
        </div>
      </div>
    </div>
  );
}
