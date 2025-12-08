import React from 'react';

export const ImportantNotices = (): React.JSX.Element => {
  return (
    <div className="mb-6 space-y-4">
      {/* Appointment Information Box */}
      <div className="rounded-lg bg-blue-50 p-4">
        <h3 className="mb-3 font-semibold text-blue-900">
          <i className="fa-solid fa-circle-info mr-2"></i>
          Appointment Information
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
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
      <div className="rounded-lg bg-green-50 p-4">
        <h3 className="mb-2 font-semibold text-green-900">
          <i className="fa-solid fa-shield-halved mr-2"></i>
          For Armed Forces Personnel
        </h3>
        <p className="text-sm text-green-800">
          Armed Forces personnel (Army, Navy, Air Force) and their dependents
          are welcome. A valid Service/ESM/Dependent ID must be presented.{' '}
          <strong>Available only offline at clinic location.</strong>
        </p>
      </div>

      {/* Follow-up Appointments Box */}
      <div className="rounded-lg bg-amber-50 p-4">
        <h3 className="mb-2 font-semibold text-amber-900">
          <i className="fa-solid fa-calendar-plus mr-2"></i>
          Follow-up Appointments
        </h3>
        <p className="text-sm text-amber-800">
          First (1st) Follow-up appointments within 2 weeks are free of charge.{' '}
          <strong className="text-amber-900">
            Follow-ups must be booked offline at the clinic location.
          </strong>
        </p>
      </div>
    </div>
  );
};
