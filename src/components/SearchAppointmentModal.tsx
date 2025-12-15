import React, {useState, useEffect} from 'react';
import {ClipLoader} from 'react-spinners';
import {BookingReceipt} from './BookingReceipt';
import {useTheme} from '@/hooks/useTheme';
import {appStore} from '@/appStore/appStore';
import type {PaymentBookingData} from '../types/types';

interface SearchAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingTableData {
  slotNumber: number;
  name: string;
  phone: string;
  date: string;
  gender: string;
  age: number;
  amount: number;
  paymentId: string;
  orderId: string;
  paymentMethod?: string;
  timestamp?: string;
}

export const SearchAppointmentModal: React.FC<SearchAppointmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<PaymentBookingData | null>(
    null,
  );
  const [multipleBookings, setMultipleBookings] = useState<BookingTableData[]>(
    [],
  );
  const [isMultiple, setIsMultiple] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {actualTheme} = useTheme();
  const setMobileNavOpen = appStore(state => state.setMobileNavOpen);

  // Hide floating icons when modal is open
  useEffect(() => {
    if (isOpen) {
      setMobileNavOpen(true);
    } else {
      setMobileNavOpen(false);
    }
  }, [isOpen, setMobileNavOpen]);

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = actualTheme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary =
    actualTheme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const inputBg = actualTheme === 'light' ? 'bg-white' : 'bg-gray-700';
  const inputBorder =
    actualTheme === 'light' ? 'border-gray-300' : 'border-gray-600';
  const inputText = actualTheme === 'light' ? 'text-gray-900' : 'text-white';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim() || !date) {
      setError('Please fill in both phone number and date');
      return;
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError(null);
    setBookingData(null);
    setMultipleBookings([]);
    setIsMultiple(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/appointment/search`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({phone, date}),
        },
      );

      const data = await response.json();

      if (data.success) {
        if (data.multiple) {
          // Multiple bookings - show table
          setMultipleBookings(data.bookings);
          setIsMultiple(true);
        } else {
          // Single booking - show receipt directly
          setBookingData(data.booking);
          setIsMultiple(false);
        }
      } else {
        // Handle geolocation restriction specifically
        if (data.code === 'GEO_RESTRICTED') {
          setError(
            'This service is only available in India. Please contact us if you believe this is an error.',
          );
        } else {
          setError(
            data.error ||
              'No booking found for the provided phone number and date',
          );
        }
      }
    } catch (error) {
      console.error('Error searching appointment:', error);
      setError('Failed to search appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = (booking: BookingTableData) => {
    const receiptData: PaymentBookingData = {
      slotNumber: booking.slotNumber,
      date: booking.date,
      name: booking.name,
      gender: booking.gender,
      age: booking.age,
      phone: booking.phone,
      amount: booking.amount,
      paymentId: booking.paymentId,
      orderId: booking.orderId,
      paymentMethod: booking.paymentMethod,
    };
    setBookingData(receiptData);
    setIsMultiple(false);
  };

  const handleClose = () => {
    setPhone('');
    setDate('');
    setBookingData(null);
    setMultipleBookings([]);
    setIsMultiple(false);
    setError(null);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title">
      <div
        className={`max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl ${bgColor} shadow-xl`}
        role="document">
        {/* Header */}
        <header className="flex items-center justify-between border-b p-6">
          <h1
            id="search-modal-title"
            className={`text-2xl font-bold ${textColor}`}>
            <i
              className="fa-solid fa-search mr-3 text-blue-600"
              aria-hidden="true"></i>
            Search Appointment/Receipt
          </h1>
          <button
            onClick={handleClose}
            className={`text-2xl ${textSecondary} cursor-pointer transition-colors hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none`}
            aria-label="Close search modal">
            ×
          </button>
        </header>

        <main className="p-6">
          {!bookingData && !isMultiple ? (
            /* Search Form */
            <section
              className="space-y-6"
              aria-labelledby="search-form-heading">
              <header>
                <h2 id="search-form-heading" className="sr-only">
                  Search for Your Appointment
                </h2>
                <p className={`${textSecondary} text-center`}>
                  Enter your phone number and booking date to find your
                  appointment receipt
                </p>
              </header>

              <form onSubmit={handleSearch} className="space-y-4" role="search">
                <fieldset className="space-y-4">
                  <legend className="sr-only">Search Criteria</legend>

                  <div>
                    <label
                      htmlFor="search-phone"
                      className={`mb-2 block text-sm font-medium ${textSecondary}`}>
                      Phone Number{' '}
                      <span className="text-red-500" aria-label="required">
                        *
                      </span>
                    </label>
                    <input
                      type="tel"
                      id="search-phone"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Enter 10-digit phone number"
                      className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                      maxLength={10}
                      disabled={loading}
                      required
                      aria-describedby="phone-help"
                    />
                    <div
                      id="phone-help"
                      className={`mt-1 text-xs ${textSecondary}`}>
                      Enter the phone number used for booking
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="search-date"
                      className={`mb-2 block text-sm font-medium ${textSecondary}`}>
                      Booking Date{' '}
                      <span className="text-red-500" aria-label="required">
                        *
                      </span>
                    </label>
                    <input
                      type="date"
                      id="search-date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                      disabled={loading}
                      required
                      aria-describedby="date-help"
                    />
                    <div
                      id="date-help"
                      className={`mt-1 text-xs ${textSecondary}`}>
                      Select the date of your appointment
                    </div>
                  </div>
                </fieldset>

                {error && (
                  <div
                    className="rounded-lg bg-red-50 p-4"
                    role="alert"
                    aria-live="polite">
                    <p className="text-sm text-red-700">
                      <i
                        className="fa-solid fa-exclamation-triangle mr-2"
                        aria-hidden="true"></i>
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !phone.trim() || !date}
                  className="w-full cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-describedby="search-button-help">
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <ClipLoader size={20} color="white" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <>
                      <i
                        className="fa-solid fa-search mr-2"
                        aria-hidden="true"></i>
                      Search Appointment
                    </>
                  )}
                </button>
                <div
                  id="search-button-help"
                  className={`text-xs ${textSecondary} text-center`}>
                  Click to search for your appointment receipt
                </div>
              </form>
            </section>
          ) : isMultiple ? (
            /* Multiple Bookings Table */
            <section
              className="space-y-4"
              aria-labelledby="multiple-results-heading">
              <header className="flex items-center justify-between">
                <h2
                  id="multiple-results-heading"
                  className={`text-lg font-semibold ${textColor}`}>
                  Multiple Appointments Found! ({multipleBookings.length}{' '}
                  appointments)
                </h2>
                <button
                  onClick={() => {
                    setMultipleBookings([]);
                    setIsMultiple(false);
                    setError(null);
                  }}
                  className="cursor-pointer font-medium text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
                  aria-label="Go back to search form">
                  <i
                    className="fa-solid fa-arrow-left mr-2"
                    aria-hidden="true"></i>
                  Search Again
                </button>
              </header>

              <div className="overflow-x-auto">
                <table
                  className={`w-full border-collapse border ${inputBorder} rounded-lg`}
                  role="table"
                  aria-label="Multiple appointment results">
                  <thead
                    className={`${actualTheme === 'light' ? 'bg-gray-50' : 'bg-gray-700'}`}>
                    <tr role="row">
                      <th
                        className={`border ${inputBorder} px-4 py-3 text-left text-sm font-medium ${textColor}`}
                        scope="col">
                        Slot #
                      </th>
                      <th
                        className={`border ${inputBorder} px-4 py-3 text-left text-sm font-medium ${textColor}`}
                        scope="col">
                        Name
                      </th>
                      <th
                        className={`border ${inputBorder} px-4 py-3 text-left text-sm font-medium ${textColor}`}
                        scope="col">
                        Age/Gender
                      </th>
                      <th
                        className={`border ${inputBorder} px-4 py-3 text-left text-sm font-medium ${textColor}`}
                        scope="col">
                        Amount
                      </th>
                      <th
                        className={`border ${inputBorder} px-4 py-3 text-center text-sm font-medium ${textColor}`}
                        scope="col">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {multipleBookings.map((booking, index) => (
                      <tr
                        key={index}
                        role="row"
                        className={
                          index % 2 === 0
                            ? ''
                            : actualTheme === 'light'
                              ? 'bg-gray-50'
                              : 'bg-gray-700'
                        }>
                        <td
                          className={`border ${inputBorder} px-4 py-3 text-sm ${textColor} font-medium`}
                          role="cell">
                          #{booking.slotNumber}
                        </td>
                        <td
                          className={`border ${inputBorder} px-4 py-3 text-sm ${textColor}`}
                          role="cell">
                          {booking.name}
                        </td>
                        <td
                          className={`border ${inputBorder} px-4 py-3 text-sm ${textColor}`}
                          role="cell">
                          {booking.age}Y / {booking.gender}
                        </td>
                        <td
                          className={`border ${inputBorder} px-4 py-3 text-sm ${textColor} font-medium`}
                          role="cell">
                          ₹{booking.amount}
                        </td>
                        <td
                          className={`border ${inputBorder} px-4 py-3 text-center`}
                          role="cell">
                          <button
                            onClick={() => handleViewReceipt(booking)}
                            className="cursor-pointer rounded bg-blue-600 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
                            aria-label={`View receipt for ${booking.name}, slot ${booking.slotNumber}`}>
                            <i
                              className="fa-solid fa-receipt mr-1"
                              aria-hidden="true"></i>
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            /* Single Booking Receipt */
            <section className="space-y-4" aria-labelledby="receipt-heading">
              <header className="flex items-center justify-between">
                <h2
                  id="receipt-heading"
                  className={`text-lg font-semibold ${textColor}`}>
                  Appointment Found!
                </h2>
                <button
                  onClick={() => {
                    setBookingData(null);
                    setError(null);
                  }}
                  className="cursor-pointer font-medium text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
                  aria-label="Go back to search form">
                  <i
                    className="fa-solid fa-arrow-left mr-2"
                    aria-hidden="true"></i>
                  Search Again
                </button>
              </header>

              <BookingReceipt bookingData={bookingData!} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
