import React from 'react';
import {ClipLoader} from 'react-spinners';
import {useTheme} from '@/hooks/useTheme';
import {useClinicStatus} from '@/hooks/useClinicStatus';

interface AppointmentFormProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  name: string;
  setName: (name: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  age: string;
  setAge: (age: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  loading: boolean;
  availableSlots: number;
  onSubmit: (e: React.FormEvent) => void;
  today: string;
  maxDate: string;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  selectedDate,
  setSelectedDate,
  name,
  setName,
  gender,
  setGender,
  age,
  setAge,
  phone,
  setPhone,
  loading,
  availableSlots,
  onSubmit,
  today,
  maxDate,
}) => {
  const {actualTheme} = useTheme();
  const {isClinicClosed} = useClinicStatus();

  const textColor = actualTheme === 'light' ? 'text-gray-700' : 'text-gray-200';
  const textTertiary =
    actualTheme === 'light' ? 'text-gray-500' : 'text-gray-300';
  const inputBg = actualTheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputBorder =
    actualTheme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputText = actualTheme === 'light' ? 'text-gray-900' : 'text-white';

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
      role="form"
      aria-labelledby="appointment-form-heading"
      noValidate>
      <h2 id="appointment-form-heading" className="sr-only">
        Book ENT Appointment Form
      </h2>

      {/* Date Selection */}
      <fieldset className="space-y-2">
        <legend className="sr-only">Select appointment date</legend>
        <label
          htmlFor="appointment-date"
          className={`mb-2 block text-sm font-semibold ${textColor}`}>
          Select Appointment Date{' '}
          <span className="text-red-500" aria-label="required">
            *
          </span>
        </label>
        <input
          type="date"
          id="appointment-date"
          name="appointmentDate"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          min={today}
          max={maxDate}
          required
          aria-required="true"
          aria-describedby="date-help"
          className={`w-full rounded-lg border-2 ${inputBorder} ${inputBg} ${inputText} px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none`}
        />
        <p id="date-help" className={`mt-1 text-xs ${textTertiary}`}>
          Bookings available up to 10 days in advance
        </p>
      </fieldset>

      {/* Patient Information */}
      <fieldset className="space-y-4">
        <legend className={`mb-4 text-lg font-semibold ${textColor}`}>
          Patient Information
        </legend>

        {/* Name */}
        <div>
          <label
            htmlFor="patient-name"
            className={`mb-2 block text-sm font-semibold ${textColor}`}>
            Patient Full Name{' '}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </label>
          <input
            type="text"
            id="patient-name"
            name="patientName"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            aria-required="true"
            placeholder="Enter patient's full name"
            autoComplete="name"
            className={`w-full rounded-lg border-2 ${inputBorder} ${inputBg} ${inputText} px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none`}
          />
        </div>

        {/* Gender */}
        <fieldset>
          <legend className={`mb-2 block text-sm font-semibold ${textColor}`}>
            Gender{' '}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </legend>
          <div className="flex gap-4" role="radiogroup" aria-required="true">
            {['male', 'female', 'others'].map(g => (
              <label key={g} className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={e => setGender(e.target.value)}
                  required
                  aria-required="true"
                  className="mr-2 h-4 w-4 cursor-pointer text-blue-600 focus:ring-2 focus:ring-blue-200"
                />
                <span className={`${textColor} capitalize`}>{g}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Age */}
        <div>
          <label
            htmlFor="patient-age"
            className={`mb-2 block text-sm font-semibold ${textColor}`}>
            Age{' '}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </label>
          <input
            type="number"
            id="patient-age"
            name="patientAge"
            value={age}
            onChange={e => setAge(e.target.value)}
            required
            aria-required="true"
            min="1"
            max="120"
            placeholder="Enter age in years"
            aria-describedby="age-help"
            className={`w-full rounded-lg border-2 ${inputBorder} ${inputBg} ${inputText} px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none`}
          />
          <p id="age-help" className="sr-only">
            Enter age between 1 and 120 years
          </p>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="patient-phone"
            className={`mb-2 block text-sm font-semibold ${textColor}`}>
            Mobile Number{' '}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </label>
          <input
            type="tel"
            id="patient-phone"
            name="patientPhone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            aria-required="true"
            pattern="[6-9][0-9]{9}"
            placeholder="10-digit mobile number"
            autoComplete="tel"
            aria-describedby="phone-help"
            className={`w-full rounded-lg border-2 ${inputBorder} ${inputBg} ${inputText} px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none`}
          />
          <p id="phone-help" className={`mt-1 text-xs ${textTertiary}`}>
            Enter 10-digit Indian mobile number starting with 6-9
          </p>
        </div>
      </fieldset>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || availableSlots <= 0 || isClinicClosed}
        aria-describedby="submit-help"
        className={`w-full cursor-pointer rounded-lg px-6 py-4 font-semibold text-white transition-all duration-200 focus:ring-4 focus:ring-blue-300 focus:outline-none ${
          loading || availableSlots <= 0 || isClinicClosed
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
        }`}>
        {loading ? (
          <span className="flex items-center justify-center" aria-live="polite">
            <ClipLoader size={20} color="#ffffff" loading={loading} />
            <span className="ml-2">Processing appointment...</span>
          </span>
        ) : isClinicClosed ? (
          <>
            <i className="fa-solid fa-ban mr-2" aria-hidden="true"></i>
            Clinic Temporarily Closed
          </>
        ) : availableSlots <= 0 ? (
          <>
            <i
              className="fa-solid fa-calendar-xmark mr-2"
              aria-hidden="true"></i>
            No Online Slots Available
          </>
        ) : (
          <>
            <i
              className="fa-solid fa-calendar-check mr-2"
              aria-hidden="true"></i>
            Book Appointment & Pay ₹400
          </>
        )}
      </button>

      <p id="submit-help" className="sr-only">
        {isClinicClosed
          ? 'Clinic is temporarily closed. Please contact us for urgent consultations.'
          : availableSlots <= 0
            ? 'No online slots available. Please select another date or visit clinic directly.'
            : 'Click to proceed with secure online payment via PhonePe'}
      </p>
    </form>
  );
};
