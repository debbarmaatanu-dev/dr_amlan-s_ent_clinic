import React from 'react';
import {useTheme} from '@/hooks/useTheme';
import {useClinicStatus} from '@/hooks/useClinicStatus';

interface SlotAvailabilityProps {
  availableSlots: number;
  selectedDate: string;
}

export const SlotAvailability: React.FC<SlotAvailabilityProps> = ({
  availableSlots,
  selectedDate,
}) => {
  const {actualTheme} = useTheme();
  const {isClinicClosed} = useClinicStatus();

  const textColor = actualTheme === 'light' ? 'text-gray-700' : 'text-gray-200';

  if (!selectedDate) return null;

  // Show clinic closed status if manually closed
  if (isClinicClosed) {
    return (
      <div className="mb-6 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${textColor}`}>Clinic Status</p>
            <p className="text-md font-bold text-red-600">Temporarily Closed</p>
          </div>
          <div>
            <i className="fa-solid fa-ban text-lg text-red-500"></i>
          </div>
        </div>
        <p className="mt-2 text-sm text-red-600">
          Online bookings are temporarily unavailable. Please contact us for
          urgent consultations.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`mb-6 rounded-lg border-2 px-4 py-3 ${
        availableSlots > 0
          ? 'border-green-300 bg-green-50'
          : 'border-red-300 bg-red-50'
      }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor}`}>
            Available Online Slots
          </p>
          <p
            className={`text-md font-bold ${
              availableSlots > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
            {availableSlots} / 10
          </p>
        </div>
        <div>
          {availableSlots > 0 ? (
            <i className="fa-solid fa-circle-check text-lg text-green-500"></i>
          ) : (
            <i className="fa-solid fa-circle-xmark text-lg text-red-500"></i>
          )}
        </div>
      </div>
      {availableSlots <= 0 && (
        <p className="mt-2 text-sm text-red-600">
          No online slots available. Please visit the clinic directly or select
          another date.
        </p>
      )}
    </div>
  );
};
