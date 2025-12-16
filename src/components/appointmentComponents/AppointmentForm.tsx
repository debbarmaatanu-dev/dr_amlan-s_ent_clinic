import React, {useState, useCallback} from 'react';
import {ClipLoader} from 'react-spinners';
import {useTheme} from '@/hooks/useTheme';
import {useClinicStatus} from '@/hooks/useClinicStatus';

interface FieldError {
  field: string;
  message: string;
}

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
  const {isClinicClosed, clinicStatus} = useClinicStatus();

  // Field-level validation state
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const textColor = actualTheme === 'light' ? 'text-gray-700' : 'text-gray-200';
  const textTertiary =
    actualTheme === 'light' ? 'text-gray-500' : 'text-gray-300';
  const inputBg = actualTheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputBorder =
    actualTheme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputText = actualTheme === 'light' ? 'text-gray-900' : 'text-white';

  // Validation functions
  const validateField = useCallback(
    (field: string, value: string): string | null => {
      switch (field) {
        case 'selectedDate': {
          if (!value) return 'Please select an appointment date';
          const selectedDateObj = new Date(value);
          const todayObj = new Date(today);
          const maxDateObj = new Date(maxDate);
          if (selectedDateObj < todayObj) return 'Cannot select past dates';
          if (selectedDateObj > maxDateObj)
            return 'Cannot book more than 10 days in advance';
          return null;
        }

        case 'name': {
          if (!value.trim()) return 'Patient name is required';
          if (value.trim().length < 2)
            return 'Name must be at least 2 characters';
          if (!/^[a-zA-Z\s.]+$/.test(value.trim()))
            return 'Name can only contain letters, spaces, and dots';
          return null;
        }

        case 'gender': {
          if (!value) return 'Please select gender';
          return null;
        }

        case 'age': {
          if (!value) return 'Age is required';
          const ageNum = parseInt(value);
          if (isNaN(ageNum) || ageNum < 1) return 'Age must be at least 1';
          if (ageNum > 120) return 'Age cannot exceed 120';
          return null;
        }

        case 'phone': {
          if (!value.trim()) return 'Mobile number is required';
          const phoneRegex = /^[6-9]\d{9}$/;
          if (!phoneRegex.test(value.trim()))
            return 'Enter valid 10-digit mobile number starting with 6-9';
          return null;
        }

        default:
          return null;
      }
    },
    [today, maxDate],
  );

  // Calculate clinic closed message
  const clinicClosedMessage =
    isClinicClosed && clinicStatus?.displayMessage
      ? clinicStatus.displayMessage
      : '';

  // Real-time validation (only after submit attempted)
  const currentFieldErrors = submitAttempted
    ? (() => {
        const errors: FieldError[] = [];

        ['selectedDate', 'name', 'gender', 'age', 'phone'].forEach(field => {
          let value = '';
          switch (field) {
            case 'selectedDate': {
              value = selectedDate;
              break;
            }
            case 'name': {
              value = name;
              break;
            }
            case 'gender': {
              value = gender;
              break;
            }
            case 'age': {
              value = age;
              break;
            }
            case 'phone': {
              value = phone;
              break;
            }
            default:
              break;
          }

          const error = validateField(field, value);
          if (error) {
            errors.push({field, message: error});
          }
        });

        return errors;
      })()
    : fieldErrors;

  const getFieldError = (field: string): string | null => {
    const error = currentFieldErrors.find(err => err.field === field);
    return error ? error.message : null;
  };

  const hasFieldError = (field: string): boolean => {
    return currentFieldErrors.some(err => err.field === field);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Validate all fields
    const errors: FieldError[] = [];

    ['selectedDate', 'name', 'gender', 'age', 'phone'].forEach(field => {
      let value = '';
      switch (field) {
        case 'selectedDate': {
          value = selectedDate;
          break;
        }
        case 'name': {
          value = name;
          break;
        }
        case 'gender': {
          value = gender;
          break;
        }
        case 'age': {
          value = age;
          break;
        }
        case 'phone': {
          value = phone;
          break;
        }
        default:
          break;
      }

      const error = validateField(field, value);
      if (error) {
        errors.push({field, message: error});
      }
    });

    setFieldErrors(errors);

    // If no validation errors, proceed with form submission
    if (errors.length === 0) {
      onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
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
          aria-describedby="date-help date-error"
          className={`w-full rounded-lg border-2 ${
            hasFieldError('selectedDate')
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : `${inputBorder} focus:border-blue-500 focus:ring-blue-200`
          } ${inputBg} ${inputText} px-4 py-3 transition-colors focus:ring-2 focus:outline-none`}
        />
        {hasFieldError('selectedDate') && (
          <p id="date-error" className="mt-1 text-sm text-red-600">
            <i className="fa-solid fa-exclamation-circle mr-1"></i>
            {getFieldError('selectedDate')}
          </p>
        )}
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
            aria-describedby="name-error"
            placeholder="Enter patient's full name"
            autoComplete="name"
            className={`w-full rounded-lg border-2 ${
              hasFieldError('name')
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : `${inputBorder} focus:border-blue-500 focus:ring-blue-200`
            } ${inputBg} ${inputText} px-4 py-3 transition-colors focus:ring-2 focus:outline-none`}
          />
          {hasFieldError('name') && (
            <p id="name-error" className="mt-1 text-sm text-red-600">
              <i className="fa-solid fa-exclamation-circle mr-1"></i>
              {getFieldError('name')}
            </p>
          )}
        </div>

        {/* Gender */}
        <fieldset>
          <legend className={`mb-2 block text-sm font-semibold ${textColor}`}>
            Gender{' '}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </legend>
          <div
            className="flex gap-4"
            role="radiogroup"
            aria-required="true"
            aria-describedby="gender-error">
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
                  className={`mr-2 h-4 w-4 cursor-pointer focus:ring-2 ${
                    hasFieldError('gender')
                      ? 'text-red-600 focus:ring-red-200'
                      : 'text-blue-600 focus:ring-blue-200'
                  }`}
                />
                <span className={`${textColor} capitalize`}>{g}</span>
              </label>
            ))}
          </div>
          {hasFieldError('gender') && (
            <p id="gender-error" className="mt-1 text-sm text-red-600">
              <i className="fa-solid fa-exclamation-circle mr-1"></i>
              {getFieldError('gender')}
            </p>
          )}
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
            aria-describedby="age-help age-error"
            className={`w-full rounded-lg border-2 ${
              hasFieldError('age')
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : `${inputBorder} focus:border-blue-500 focus:ring-blue-200`
            } ${inputBg} ${inputText} px-4 py-3 transition-colors focus:ring-2 focus:outline-none`}
          />
          {hasFieldError('age') && (
            <p id="age-error" className="mt-1 text-sm text-red-600">
              <i className="fa-solid fa-exclamation-circle mr-1"></i>
              {getFieldError('age')}
            </p>
          )}
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
            aria-describedby="phone-help phone-error"
            className={`w-full rounded-lg border-2 ${
              hasFieldError('phone')
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : `${inputBorder} focus:border-blue-500 focus:ring-blue-200`
            } ${inputBg} ${inputText} px-4 py-3 transition-colors focus:ring-2 focus:outline-none`}
          />
          {hasFieldError('phone') && (
            <p id="phone-error" className="mt-1 text-sm text-red-600">
              <i className="fa-solid fa-exclamation-circle mr-1"></i>
              {getFieldError('phone')}
            </p>
          )}
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

      {/* Clinic Closed Message - Below Button */}
      {isClinicClosed && clinicClosedMessage && (
        <aside
          className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4"
          role="alert"
          aria-live="polite"
          aria-labelledby="clinic-closed-heading">
          <div className="flex items-start">
            <i
              className="fa-solid fa-exclamation-triangle mt-0.5 mr-3 text-red-500"
              aria-hidden="true"></i>
            <div>
              <h4
                id="clinic-closed-heading"
                className="mb-1 text-sm font-semibold text-red-800">
                Clinic Temporarily Closed
              </h4>
              <p className="text-sm text-red-700">{clinicClosedMessage}</p>
              <p className="mt-2 text-xs text-red-600">
                For urgent consultations, please contact us directly.
              </p>
            </div>
          </div>
        </aside>
      )}

      {/* No Slots Available Message - Below Button */}
      {!isClinicClosed && availableSlots <= 0 && selectedDate && (
        <aside
          className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-4"
          role="alert"
          aria-live="polite"
          aria-labelledby="no-slots-heading">
          <div className="flex items-start">
            <i
              className="fa-solid fa-calendar-xmark mt-0.5 mr-3 text-orange-500"
              aria-hidden="true"></i>
            <div>
              <h4
                id="no-slots-heading"
                className="mb-1 text-sm font-semibold text-orange-800">
                No Online Slots Available
              </h4>
              <p className="text-sm text-orange-700">
                All online slots for{' '}
                {new Date(selectedDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                are booked.
              </p>
              <p className="mt-2 text-xs text-orange-600">
                Please select another date or visit the clinic directly for
                walk-in consultation.
              </p>
            </div>
          </div>
        </aside>
      )}

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
