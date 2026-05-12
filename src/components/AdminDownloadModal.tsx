import React, {useState} from 'react';
import {ClipLoader} from 'react-spinners';
import {ReceiptView} from './shared/ReceiptView';
import {useModalTheme} from '@/hooks/useModalTheme';
import {useModalState} from '@/hooks/useModalState';
import {
  handleGeoRestrictionError,
  createModalCloseHandler,
} from '@/utils/modalHelpers';
import type {PaymentBookingData} from '../types/types';
import type {BookingTableData} from '../types/booking';
import {logger} from '@/utils/logger';

interface AdminDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDownloadModal: React.FC<AdminDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<BookingTableData[]>([]);
  const [selectedBooking, setSelectedBooking] =
    useState<PaymentBookingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use unified hooks
  const {
    bgColor,
    textColor,
    textSecondary,
    inputBg,
    inputBorder,
    inputText,
    tableBg,
    borderColor,
  } = useModalTheme();

  useModalState(isOpen);

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    // Clear previous results when date changes — do NOT auto-fetch
    setBookings([]);
    setError(null);
  };

  const handleSearch = async () => {
    if (!selectedDate) return;

    setLoading(true);
    setError(null);
    setBookings([]);

    try {
      // Get Firebase auth token
      const {auth} = await import('@/services/firebase');
      const user = auth.currentUser;
      if (!user) {
        setError('Authentication required. Please log in again.');
        return;
      }

      // Force token refresh to ensure it's valid
      const token = await user.getIdToken(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/protected/bookings/${selectedDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.success && data.bookings) {
        setBookings(data.bookings);
      } else {
        // Handle geolocation restriction specifically
        setError(handleGeoRestrictionError(data));
      }
    } catch (error) {
      logger.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings. Please try again.');
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
      paymentStatus: booking.paymentStatus,
      refundInfo: booking.refundInfo,
    };
    setSelectedBooking(receiptData);
  };

  const handleClose = createModalCloseHandler(
    [
      () => setSelectedDate(''),
      () => setBookings([]),
      () => setSelectedBooking(null),
      () => setError(null),
      () => setLoading(false),
    ],
    onClose,
  );

  if (!isOpen) return null;

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title">
      <div
        className={`max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl ${bgColor} shadow-xl`}
        role="document">
        {/* Header */}
        <header className="flex items-center justify-between border-b p-6">
          <h1
            id="admin-modal-title"
            className={`text-2xl font-bold ${textColor}`}>
            <i
              className="fa-solid fa-download mr-3 text-green-600"
              aria-hidden="true"></i>
            Download Bookings (Admin)
          </h1>
          <button
            onClick={handleClose}
            className={`cursor-pointer text-2xl ${textSecondary} transition-colors hover:text-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none`}
            aria-label="Close admin modal">
            ×
          </button>
        </header>

        <main className="p-6">
          {!selectedBooking ? (
            <section
              className="space-y-6"
              aria-labelledby="date-selector-heading">
              {/* Date Selector */}
              <div>
                <label
                  htmlFor="admin-date"
                  className={`mb-2 block text-sm font-medium ${textSecondary}`}>
                  <h2
                    id="date-selector-heading"
                    className="mb-2 text-lg font-semibold">
                    Select Date to Download Bookings
                  </h2>
                </label>
                <input
                  type="date"
                  id="admin-date"
                  value={selectedDate}
                  onChange={handleDateSelect}
                  className={`w-full rounded-lg border ${inputBorder} ${inputBg} ${inputText} px-4 py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                  disabled={loading}
                  aria-describedby="date-help"
                />
                <div id="date-help" className={`mt-1 text-xs ${textSecondary}`}>
                  Select a date to view all bookings for that day
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={loading || !selectedDate}
                className="w-full cursor-pointer rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Fetch bookings for selected date">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <ClipLoader size={20} color="white" />
                    <span>Loading bookings...</span>
                  </div>
                ) : (
                  <>
                    <i
                      className="fa-solid fa-magnifying-glass mr-2"
                      aria-hidden="true"></i>
                    Fetch Bookings
                  </>
                )}
              </button>

              {/* Error State */}
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

              {/* Bookings Table */}
              {bookings.length > 0 && (
                <section
                  className="space-y-4"
                  aria-labelledby="bookings-table-heading">
                  <header>
                    <h3
                      id="bookings-table-heading"
                      className={`text-lg font-semibold ${textColor}`}>
                      Bookings for{' '}
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString(
                        'en-IN',
                        {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        },
                      )}{' '}
                      ({bookings.length} appointments)
                    </h3>
                  </header>

                  <div className="overflow-x-auto">
                    <table
                      className={`w-full border-collapse border ${borderColor} rounded-lg`}
                      role="table"
                      aria-label={`Bookings for ${selectedDate}`}>
                      <thead className={`${tableBg}`}>
                        <tr role="row">
                          <th
                            className={`border ${borderColor} px-4 py-3 text-left text-sm font-medium ${textColor}`}
                            scope="col">
                            Slot #
                          </th>
                          <th
                            className={`border ${borderColor} px-4 py-3 text-left text-sm font-medium ${textColor}`}
                            scope="col">
                            Name
                          </th>
                          <th
                            className={`border ${borderColor} px-4 py-3 text-left text-sm font-medium ${textColor}`}
                            scope="col">
                            Phone
                          </th>
                          <th
                            className={`border ${borderColor} px-4 py-3 text-left text-sm font-medium ${textColor}`}
                            scope="col">
                            Age/Gender
                          </th>
                          <th
                            className={`border ${borderColor} px-4 py-3 text-left text-sm font-medium ${textColor}`}
                            scope="col">
                            Amount
                          </th>
                          <th
                            className={`border ${borderColor} px-4 py-3 text-center text-sm font-medium ${textColor}`}
                            scope="col">
                            Payment Status
                          </th>
                          <th
                            className={`border ${borderColor} px-4 py-3 text-center text-sm font-medium ${textColor}`}
                            scope="col">
                            Receipt
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking, index) => (
                          <tr
                            key={index}
                            role="row"
                            className={index % 2 === 0 ? '' : tableBg}>
                            <td
                              className={`border ${borderColor} px-4 py-3 text-sm ${textColor} font-medium`}
                              role="cell">
                              #{booking.slotNumber}
                            </td>
                            <td
                              className={`border ${borderColor} px-4 py-3 text-sm ${textColor}`}
                              role="cell">
                              {booking.name}
                            </td>
                            <td
                              className={`border ${borderColor} px-4 py-3 text-sm ${textColor}`}
                              role="cell">
                              +91 {booking.phone}
                            </td>
                            <td
                              className={`border ${borderColor} px-4 py-3 text-sm ${textColor}`}
                              role="cell">
                              {booking.age}Y / {booking.gender}
                            </td>
                            <td
                              className={`border ${borderColor} px-4 py-3 text-sm ${textColor} font-medium`}
                              role="cell">
                              ₹{booking.amount}
                            </td>
                            <td
                              className={`border ${borderColor} px-4 py-3 text-center`}
                              role="cell">
                              {booking.paymentStatus === 'successful' && (
                                <span
                                  className="inline-flex items-center rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-medium text-white"
                                  aria-label="Payment successful">
                                  <i
                                    className="fa-solid fa-check-circle mr-1"
                                    aria-hidden="true"></i>
                                  Successful
                                </span>
                              )}
                              {booking.paymentStatus === 'refund_initiated' && (
                                <span
                                  className="inline-flex cursor-help items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/20 dark:text-orange-200"
                                  title={`Refund ID: ${booking.refundInfo?.refundId || 'N/A'}\nReason: ${booking.refundInfo?.reason || 'N/A'}`}
                                  aria-label={`Refund initiated. Refund ID: ${booking.refundInfo?.refundId || 'N/A'}`}>
                                  <i
                                    className="fa-solid fa-undo mr-1"
                                    aria-hidden="true"></i>
                                  Refund Initiated
                                </span>
                              )}
                              {booking.paymentStatus === 'refund_pending' && (
                                <span
                                  className="inline-flex cursor-help items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-200"
                                  title={`Manual refund required\nReason: ${booking.refundInfo?.reason || 'N/A'}`}
                                  aria-label={`Refund pending. Reason: ${booking.refundInfo?.reason || 'N/A'}`}>
                                  <i
                                    className="fa-solid fa-exclamation-triangle mr-1"
                                    aria-hidden="true"></i>
                                  Pending
                                </span>
                              )}
                              {!booking.paymentStatus && (
                                <span
                                  className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-200"
                                  aria-label="Payment successful">
                                  <i
                                    className="fa-solid fa-check-circle mr-1"
                                    aria-hidden="true"></i>
                                  Successful
                                </span>
                              )}
                            </td>
                            <td
                              className={`border ${borderColor} px-4 py-3 text-center`}
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
              )}
            </section>
          ) : (
            /* Booking Receipt View */
            <ReceiptView
              bookingData={selectedBooking}
              onBack={() => setSelectedBooking(null)}
              filePrefix="Admin"
              title="Booking Receipt"
            />
          )}
        </main>
      </div>
    </div>
  );
};
