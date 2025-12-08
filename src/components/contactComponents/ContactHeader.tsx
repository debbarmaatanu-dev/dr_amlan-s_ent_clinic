import React from 'react';

export const ContactHeader: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center pt-5">
      <h1 className="relative mb-6 inline-block text-4xl font-bold tracking-wide">
        Contact Us
        <span className="absolute right-0 -bottom-1 h-1 w-1/2 rounded bg-yellow-400"></span>
      </h1>
      <p className="mb-8 text-center text-lg text-gray-600">
        Get in touch with us for appointments or inquiries
      </p>
    </header>
  );
};
