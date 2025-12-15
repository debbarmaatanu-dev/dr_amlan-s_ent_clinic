import React from 'react';
import {useTheme} from '@/hooks/useTheme';

export const PaymentNote: React.FC = () => {
  const {actualTheme} = useTheme();

  const bgColor = actualTheme === 'light' ? 'bg-blue-50' : 'bg-blue-900';
  const borderColor =
    actualTheme === 'light' ? 'border-blue-200' : 'border-blue-700';
  const textColor = actualTheme === 'light' ? 'text-gray-700' : 'text-gray-200';

  return (
    <aside
      className={`mt-6 rounded-lg border ${borderColor} ${bgColor} p-4`}
      role="note"
      aria-labelledby="payment-info-heading">
      <h3 id="payment-info-heading" className="sr-only">
        Payment Information
      </h3>
      <p className={`text-sm ${textColor}`}>
        <i
          className="fa-solid fa-credit-card mr-2 text-blue-600"
          aria-hidden="true"></i>
        <strong>Secure Online Payment:</strong> ₹400 consultation fee via
        PhonePe
        <span className="mt-1 block text-xs opacity-75">
          Accepted methods: UPI, Debit/Credit Card, NetBanking, Digital Wallet
        </span>
      </p>
    </aside>
  );
};
