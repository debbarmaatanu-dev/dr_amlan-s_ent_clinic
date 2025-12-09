import React from 'react';
import {useTheme} from '@/hooks/useTheme';

export const ContactHeader: React.FC = () => {
  const {actualTheme} = useTheme();

  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';

  return (
    <header className="flex flex-col items-center justify-center pt-5">
      <h1
        className={`relative mb-6 inline-block text-4xl font-bold tracking-wide ${textColor}`}>
        Contact Us
        <span className="absolute right-0 -bottom-1 h-1 w-1/2 rounded bg-yellow-400"></span>
      </h1>
      <p className={`mb-8 text-center text-lg ${textSecondary}`}>
        Get in touch with us for appointments or inquiries
      </p>
    </header>
  );
};
