import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useTheme} from '@/hooks/useTheme';

export const PrivacyPolicyLink = (): React.JSX.Element => {
  const navigation = useNavigate();
  const {actualTheme} = useTheme();

  const bgColor = actualTheme === 'light' ? 'bg-gray-50' : 'bg-gray-700';
  const borderColor =
    actualTheme === 'light' ? 'border-gray-200' : 'border-gray-600';
  const textColor = actualTheme === 'light' ? 'text-gray-600' : 'text-gray-300';

  return (
    <div className={`mt-4 space-y-3`}>
      {/* Privacy Policy */}
      <div className={`rounded-lg border ${borderColor} ${bgColor} p-4`}>
        <p className={`text-xs ${textColor}`}>
          <i className={`fa-solid fa-shield-halved mr-2 ${textColor}`}></i>
          By booking an appointment, you agree to our{' '}
          <button
            role="link"
            aria-label="Link to Privacy Policy"
            onClick={() => {
              setTimeout(() => {
                void navigation('/privacy-policy');
                scrollTo(0, 0);
              }, 250);
            }}
            className="cursor-pointer font-semibold text-blue-600 underline hover:text-blue-800">
            Privacy Policy
          </button>
          . Your information is collected solely for appointment booking and
          medical consultation purposes.{' '}
          <span
            className={`${actualTheme !== 'light' ? 'font-extrabold text-white' : 'font-bold'}`}>
            {' '}
            REFUND POLICY: If payment is deducted but no booking receipt is
            received, please contact us within 2 days for a refund. Refunds will
            also be issued in case of clinic closure or doctor unavailability.
          </span>
        </p>
      </div>
    </div>
  );
};
