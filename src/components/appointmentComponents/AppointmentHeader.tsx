import React from 'react';
import {useTheme} from '@/hooks/useTheme';
import {appStore} from '@/appStore/appStore';

export const AppointmentHeader: React.FC = () => {
  const {actualTheme} = useTheme();
  const clinicStatus = appStore(state => state.clinicStatus);
  // Clinic status is fetched by Navbar (always mounted)

  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';
  const textTertiary =
    actualTheme === 'light' ? 'text-gray-500' : 'text-gray-300';

  return (
    <header className="flex flex-col items-center justify-center py-5">
      <h1
        className={`relative mb-6 inline-block text-4xl font-bold tracking-wide ${textColor}`}>
        Book Appointment
        <span className="absolute right-0 -bottom-1 h-1 w-1/2 rounded bg-yellow-400"></span>
      </h1>
      <p className={`mb-4 text-center text-lg ${textSecondary}`}>
        Schedule your visit with Dr. (Major) Amlan Debbarma
      </p>
      <p className={`text-center text-sm ${textTertiary}`}>
        Clinic Hours: 6:00 PM - 8:30 PM (Monday to Saturday)
      </p>

      {/* Manual Clinic Status Override */}
      {clinicStatus?.isManuallyOverridden && clinicStatus.displayMessage && (
        <div className="mt-4 rounded-lg bg-red-100 px-4 py-3 dark:bg-red-900/20">
          <p className="text-center font-bold text-red-800 dark:text-red-200">
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>
            {clinicStatus.displayMessage}
          </p>
        </div>
      )}
    </header>
  );
};
