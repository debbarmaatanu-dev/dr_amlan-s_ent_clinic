import React from 'react';
import {useTheme} from '@/hooks/useTheme';
import {
  PAYMENTS_OUTAGE_CONTACT_HINT,
  PAYMENTS_OUTAGE_TITLE,
  PAYMENTS_OUTAGE_USER_MESSAGE,
  PAYMENTS_TEMPORARILY_DISABLED,
} from '@/constants/paymentGateway';

export const PaymentNote: React.FC = () => {
  const {actualTheme} = useTheme();

  if (PAYMENTS_TEMPORARILY_DISABLED) {
    const bgColor = actualTheme === 'light' ? 'bg-amber-50' : 'bg-amber-950/40';
    const borderColor =
      actualTheme === 'light' ? 'border-amber-300' : 'border-amber-700';
    const titleColor =
      actualTheme === 'light' ? 'text-amber-950' : 'text-amber-100';
    const textColor =
      actualTheme === 'light' ? 'text-amber-900' : 'text-amber-100/90';
    const hintColor =
      actualTheme === 'light' ? 'text-amber-800' : 'text-amber-200/80';

    return (
      <aside
        className={`mt-6 rounded-lg border ${borderColor} ${bgColor} p-4`}
        role="alert"
        aria-live="polite"
        aria-labelledby="payment-outage-heading">
        <div className="flex items-start gap-3">
          <i
            className="fa-solid fa-circle-exclamation mt-0.5 text-lg text-amber-600"
            aria-hidden="true"></i>
          <div>
            <h3
              id="payment-outage-heading"
              className={`mb-1 text-sm font-semibold ${titleColor}`}>
              {PAYMENTS_OUTAGE_TITLE}
            </h3>
            <p className={`text-sm ${textColor}`}>
              {PAYMENTS_OUTAGE_USER_MESSAGE}
            </p>
            <p className={`mt-2 text-xs ${hintColor}`}>
              <i className="fa-solid fa-phone mr-1" aria-hidden="true"></i>
              {PAYMENTS_OUTAGE_CONTACT_HINT}
            </p>
          </div>
        </div>
      </aside>
    );
  }

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
