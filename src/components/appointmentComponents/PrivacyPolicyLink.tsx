import React from 'react';
import {useNavigate} from 'react-router-dom';

export const PrivacyPolicyLink = (): React.JSX.Element => {
  const navigation = useNavigate();
  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs text-gray-600">
        <i className="fa-solid fa-shield-halved mr-2 text-gray-600"></i>
        By booking an appointment, you agree to our{' '}
        <button
          role="link"
          aria-label="Link to Privacy Policy"
          onClick={() => {
            setTimeout(() => {
              navigation('/privacy-policy');
              scrollTo(0, 0);
            }, 250);
          }}
          className="cursor-pointer font-semibold text-blue-600 underline hover:text-blue-800">
          Privacy Policy
        </button>
        . Your information is collected solely for appointment booking and
        medical consultation purposes.
      </p>
    </div>
  );
};
