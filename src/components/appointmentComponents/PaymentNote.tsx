import React from 'react';
import {useTheme} from '@/hooks/useTheme';

export const PaymentNote: React.FC = () => {
  const {actualTheme} = useTheme();

  const bgColor = actualTheme === 'light' ? 'bg-blue-50' : 'bg-blue-900';
  const borderColor =
    actualTheme === 'light' ? 'border-blue-200' : 'border-blue-700';
  const textColor = actualTheme === 'light' ? 'text-gray-700' : 'text-gray-200';

  return (
    <div className={`mt-6 rounded-lg border ${borderColor} ${bgColor} p-4`}>
      <p className={`text-sm ${textColor}`}>
        <i className="fa-solid fa-credit-card mr-2 text-blue-600"></i>
        <strong>Online Payment:</strong> Secure payment of ₹400 via Razorpay
        (UPI, Card, NetBanking, Wallet)
      </p>
    </div>
  );
};
