import React from 'react';

export const PaymentNote: React.FC = () => {
  return (
    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <p className="text-sm text-gray-700">
        <i className="fa-solid fa-credit-card mr-2 text-blue-600"></i>
        <strong>Online Payment:</strong> Secure payment of ₹400 via Razorpay
        (UPI, Card, NetBanking, Wallet)
      </p>
    </div>
  );
};
