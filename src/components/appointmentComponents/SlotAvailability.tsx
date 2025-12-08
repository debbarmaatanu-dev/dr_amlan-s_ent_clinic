import React from 'react';

interface SlotAvailabilityProps {
  availableSlots: number;
  selectedDate: string;
}

export const SlotAvailability: React.FC<SlotAvailabilityProps> = ({
  availableSlots,
  selectedDate,
}) => {
  if (!selectedDate) return null;

  return (
    <div
      className={`mb-6 rounded-lg border-2 p-4 ${
        availableSlots > 0
          ? 'border-green-300 bg-green-50'
          : 'border-red-300 bg-red-50'
      }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Available Online Slots
          </p>
          <p
            className={`text-2xl font-bold ${
              availableSlots > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
            {availableSlots} / 10
          </p>
        </div>
        <div>
          {availableSlots > 0 ? (
            <i className="fa-solid fa-circle-check text-4xl text-green-500"></i>
          ) : (
            <i className="fa-solid fa-circle-xmark text-4xl text-red-500"></i>
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
