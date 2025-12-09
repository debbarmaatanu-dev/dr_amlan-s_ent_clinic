import React from 'react';
import {useTheme} from '@/hooks/useTheme';

export const ImportantNotices = (): React.JSX.Element => {
  const {actualTheme} = useTheme();

  const bgBlue = actualTheme === 'light' ? 'bg-blue-50' : 'bg-blue-900';
  const textBlue = actualTheme === 'light' ? 'text-blue-900' : 'text-blue-100';
  const textBlueSecondary =
    actualTheme === 'light' ? 'text-blue-800' : 'text-blue-200';
  const bgGreen = actualTheme === 'light' ? 'bg-green-50' : 'bg-green-900';
  const textGreen =
    actualTheme === 'light' ? 'text-green-900' : 'text-green-100';
  const textGreenSecondary =
    actualTheme === 'light' ? 'text-green-800' : 'text-green-200';
  const bgAmber = actualTheme === 'light' ? 'bg-amber-50' : 'bg-amber-900';
  const textAmber =
    actualTheme === 'light' ? 'text-amber-900' : 'text-amber-100';
  const textAmberSecondary =
    actualTheme === 'light' ? 'text-amber-800' : 'text-amber-200';

  return (
    <div className="mb-6 space-y-4">
      {/* Appointment Information Box */}
      <div className={`rounded-lg ${bgBlue} p-4`}>
        <h3 className={`mb-3 font-semibold ${textBlue}`}>
          <i className="fa-solid fa-circle-info mr-2"></i>
          Appointment Information
        </h3>
        <ul className={`space-y-2 text-sm ${textBlueSecondary}`}>
          <li>
            <i className="fa-solid fa-clock mr-2"></i>
            <strong>Clinic Hours:</strong> 6:00 PM - 8:30 PM (Closed on Sundays)
          </li>
          <li>
            <i className="fa-solid fa-indian-rupee-sign mr-2"></i>
            <strong>Consultation Fee:</strong> ₹400 (Fixed)
          </li>
          <li>
            <i className="fa-solid fa-calendar-check mr-2"></i>
            <strong>Online Booking Slots per Day:</strong> 10
          </li>
          <li>
            <i className="fa-solid fa-users mr-2"></i>
            <strong>Offline Booking Slots (at clinic):</strong> 10 additional
            slots available
          </li>
        </ul>
      </div>

      {/* Armed Forces Personnel Box */}
      <div className={`rounded-lg ${bgGreen} p-4`}>
        <h3 className={`mb-2 font-semibold ${textGreen}`}>
          <i className="fa-solid fa-shield-halved mr-2"></i>
          For Armed Forces Personnel
        </h3>
        <p className={`text-sm ${textGreenSecondary}`}>
          Armed Forces personnel (Army, Navy, Air Force) and their dependents
          are welcome. A valid Service/ESM/Dependent ID must be presented.{' '}
          <strong>Available only offline at clinic location.</strong>
        </p>
      </div>

      {/* Follow-up Appointments Box */}
      <div className={`rounded-lg ${bgAmber} p-4`}>
        <h3 className={`mb-2 font-semibold ${textAmber}`}>
          <i className="fa-solid fa-calendar-plus mr-2"></i>
          Follow-up Appointments
        </h3>
        <p className={`text-sm ${textAmberSecondary}`}>
          First (1st) Follow-up appointments within 2 weeks are free of charge.{' '}
          <strong className={textAmber}>
            Follow-ups must be booked offline at the clinic location.
          </strong>
        </p>
      </div>
    </div>
  );
};
