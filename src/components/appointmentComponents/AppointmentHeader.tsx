import React from 'react';
import {useTheme} from '@/hooks/useTheme';
import {useAppStore} from '@/appStore/appStore';
import {CLINIC_SCHEDULE_SUMMARY} from '@/constants/clinicSchedule';
import {
  PAYMENTS_OUTAGE_CONTACT_HINT,
  PAYMENTS_OUTAGE_TITLE,
  PAYMENTS_OUTAGE_USER_MESSAGE,
  PAYMENTS_TEMPORARILY_DISABLED,
} from '@/constants/paymentGateway';

export const AppointmentHeader: React.FC = () => {
  const {actualTheme} = useTheme();
  const clinicStatus = useAppStore(state => state.clinicStatus);
  // Clinic status is fetched by Navbar (always mounted)

  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';
  const textTertiary =
    actualTheme === 'light' ? 'text-gray-500' : 'text-gray-300';

  const outageBg = actualTheme === 'light' ? 'bg-amber-50' : 'bg-amber-950/50';
  const outageBorder =
    actualTheme === 'light' ? 'border-amber-300' : 'border-amber-700';
  const outageTitle =
    actualTheme === 'light' ? 'text-amber-950' : 'text-amber-100';
  const outageText =
    actualTheme === 'light' ? 'text-amber-900' : 'text-amber-100/90';
  const outageHint =
    actualTheme === 'light' ? 'text-amber-800' : 'text-amber-200/80';

  return (
    <header className="flex flex-col items-center justify-center py-5">
      <h1
        className={`relative mb-6 inline-block text-4xl font-bold tracking-wide ${textColor}`}>
        Book Appointment
        <span className="absolute right-0 -bottom-1 h-1 w-1/2 rounded bg-yellow-400"></span>
      </h1>
      <p className={`mb-4 text-center text-lg ${textSecondary}`}>
        Schedule your visit with Major Amlan Debbarma
      </p>
      <p className={`text-center text-sm ${textTertiary}`}>
        {CLINIC_SCHEDULE_SUMMARY}
      </p>

      {PAYMENTS_TEMPORARILY_DISABLED && (
        <div
          className={`mt-4 w-full max-w-2xl rounded-xl border ${outageBorder} ${outageBg} px-4 py-4`}
          role="alert"
          aria-live="polite">
          <p className={`text-center text-base font-semibold ${outageTitle}`}>
            <i
              className="fa-solid fa-circle-exclamation mr-2 text-amber-600"
              aria-hidden="true"></i>
            {PAYMENTS_OUTAGE_TITLE}
          </p>
          <p className={`mt-2 text-center text-sm ${outageText}`}>
            {PAYMENTS_OUTAGE_USER_MESSAGE}
          </p>
          <p className={`mt-2 text-center text-xs ${outageHint}`}>
            {PAYMENTS_OUTAGE_CONTACT_HINT}
          </p>
        </div>
      )}

      {/* Manual Clinic Status Override */}
      {clinicStatus?.isManuallyOverridden && clinicStatus.displayMessage && (
        <div className="mt-4 rounded-lg bg-red-500 px-4 py-3">
          <p className="text-center font-bold text-white">
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>
            {clinicStatus.displayMessage}
          </p>
        </div>
      )}
    </header>
  );
};
