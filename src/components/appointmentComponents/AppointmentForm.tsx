import React from 'react';
import {ClipLoader} from 'react-spinners';

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
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Date Selection */}
      <div>
        <label
          htmlFor="date"
          className="mb-2 block text-sm font-semibold text-gray-700">
          Select Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          min={today}
          max={maxDate}
          required
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Bookings available up to 10 days in advance
        </p>
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-gray-700">
          Patient Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="Enter full name"
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Gender <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {['male', 'female', 'others'].map(g => (
            <label key={g} className="flex cursor-pointer items-center">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={gender === g}
                onChange={e => setGender(e.target.value)}
                required
                className="mr-2 h-4 w-4 cursor-pointer text-blue-600"
              />
              <span className="text-gray-700 capitalize">{g}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <label
          htmlFor="age"
          className="mb-2 block text-sm font-semibold text-gray-700">
          Age <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={e => setAge(e.target.value)}
          required
          min="1"
          max="120"
          placeholder="Enter age"
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          pattern="[6-9][0-9]{9}"
          placeholder="10-digit mobile number"
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:outline-none"
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter 10-digit mobile number starting with 6-9
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || availableSlots <= 0}
        className={`w-full rounded-lg px-6 py-4 font-semibold text-white transition-all duration-200 ${
          loading || availableSlots <= 0
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
        }`}>
        {loading ? (
          <span className="flex items-center justify-center">
            <ClipLoader size={20} color="#ffffff" loading={loading} />
            <span className="ml-2">Processing...</span>
          </span>
        ) : availableSlots <= 0 ? (
          'No Online Slots Available'
        ) : (
          'Book & Pay ₹400'
        )}
      </button>
    </form>
  );
};
