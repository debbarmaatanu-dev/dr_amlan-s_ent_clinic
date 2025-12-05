import React, {useState, useEffect, useCallback} from 'react';
import {ClipLoader} from 'react-spinners';
import {
  checkAvailableSlots,
  validateBookingAvailability,
  validateDateConstraints,
  initiatePayment,
  type PaymentBookingData,
} from '@/services/appointmentService';
import {AlertModal} from '@/components/AlertModal';
import {SuccessModal} from '@/components/SuccessModal';
import {appStore} from '@/appStore/appStore';

export const Appointment = (): React.JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [availableOnlineSlots, setAvailableOnlineSlots] = useState<number>(10);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const setMobileNavOpen = appStore(state => state.setMobileNavOpen);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    type: 'error' | 'success' | 'warning';
  }>({title: '', message: '', type: 'error'});
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<PaymentBookingData | null>(
    null,
  );

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Calculate max date (10 days from today)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 10);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const fetchAvailableSlots = useCallback(
    async (dateString: string, forceRefresh = false) => {
      try {
        const availableSlots = await checkAvailableSlots(
          dateString,
          forceRefresh,
        );
        setAvailableOnlineSlots(availableSlots);
      } catch (error) {
        console.error('Error checking slots:', error);
        setAvailableOnlineSlots(10);
      }
    },
    [],
  );

  // Validate and check available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      // Validate date constraints first
      const dateValidation = validateDateConstraints(selectedDate);
      if (!dateValidation.isValid) {
        // Show error modal
        setModalContent({
          title: 'Invalid Date',
          message: dateValidation.error || 'Please select a valid date.',
          type: 'error',
        });
        setShowModal(true);

        // Clear the selected date
        setSelectedDate('');
        return;
      }

      // If valid, fetch available slots
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, fetchAvailableSlots]);

  useEffect(() => {
    if (showModal) {
      setMobileNavOpen(true);
    } else {
      setMobileNavOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedDate || !name.trim() || !gender || !age || !phone.trim()) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields',
      });
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setMessage({type: 'error', text: 'Please enter a valid age'});
      return;
    }

    // Validate phone number (Indian format: 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid 10-digit phone number',
      });
      return;
    }

    // Validate date constraints (sanity check)
    const dateValidation = validateDateConstraints(selectedDate);
    if (!dateValidation.isValid) {
      const errorMessage =
        dateValidation.error || 'Invalid date selected. Please try again.';

      setModalContent({
        title: 'Invalid Date',
        message: errorMessage,
        type: 'error',
      });
      setShowModal(true);

      setMessage({
        type: 'error',
        text: errorMessage,
      });
      return;
    }

    if (availableOnlineSlots <= 0) {
      setMessage({
        type: 'error',
        text: 'No online slots available for this date. Please select another date or visit the clinic.',
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Step 1: Pre-validate availability (early check)
      const validation = await validateBookingAvailability(selectedDate);

      if (!validation.isAvailable) {
        const errorMessage =
          validation.error || 'No slots available. Please select another date.';

        // Show modal
        setModalContent({
          title: 'Booking Failed',
          message: errorMessage,
          type: 'error',
        });
        setShowModal(true);

        // Also set text message
        setMessage({
          type: 'error',
          text: errorMessage,
        });
        setLoading(false);
        return;
      }

      // Step 2: Initiate payment and booking
      const result = await initiatePayment(
        selectedDate,
        name,
        gender,
        ageNum,
        phone,
      );

      if (result.success && result.bookingData) {
        // Show success modal with receipt
        setBookingData(result.bookingData);
        setShowSuccessModal(true);

        // Reset form
        setName('');
        setGender('');
        setAge('');
        setPhone('');
        const currentDate = selectedDate;
        setSelectedDate('');

        // Refresh available slots with force refresh (bypass cache)
        await fetchAvailableSlots(currentDate, true);
      } else {
        const errorMessage =
          result.error || 'Failed to book appointment. Please try again.';

        // Show modal
        setModalContent({
          title: 'Booking Failed',
          message: errorMessage,
          type: 'error',
        });
        setShowModal(true);

        // Also set text message
        setMessage({
          type: 'error',
          text: errorMessage,
        });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = 'Failed to book appointment. Please try again.';

      // Show modal
      setModalContent({
        title: 'Booking Error',
        message: errorMessage,
        type: 'error',
      });
      setShowModal(true);

      // Also set text message
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main
        className="flex grow items-center justify-center px-4 py-6 md:py-12 lg:px-8"
        role="main">
        <section className="w-full max-w-4xl">
          <header className="flex flex-col items-center justify-center py-5">
            <h1 className="relative mb-6 inline-block text-4xl font-bold tracking-wide">
              Book Appointment
              <span className="absolute right-0 -bottom-1 h-1 w-1/2 rounded bg-yellow-400"></span>
            </h1>
          </header>

          <article className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="p-8 md:p-12">
              {/* Important Notes Section */}
              <div className="mb-8 space-y-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h2 className="mb-2 text-lg font-semibold text-blue-800">
                    <i className="fa-solid fa-info-circle mr-2"></i>
                    Appointment Information
                  </h2>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <i className="fa-solid fa-clock mt-1 mr-2 text-blue-600"></i>
                      <span>
                        <strong>Clinic Hours:</strong> 6:00 PM - 8:30 PM (Closed
                        on Sundays)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-indian-rupee-sign mt-1 mr-2 text-blue-600"></i>
                      <span>
                        <strong>Consultation Fee:</strong> ₹400 (Fixed)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-calendar-check mt-1 mr-2 text-blue-600"></i>
                      <span>
                        <strong>Online Booking Slots per Day:</strong> 10
                      </span>
                    </li>
                    <li className="flex items-start">
                      <i className="fa-solid fa-hospital mt-1 mr-2 text-blue-600"></i>
                      <span>
                        <strong>Walk-in Slots (at clinic):</strong> 10
                        additional slots available
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h2 className="mb-2 text-lg font-semibold text-green-800">
                    <i className="fa-solid fa-shield-halved mr-2"></i>
                    For Armed Forces Personnel
                  </h2>
                  <p className="text-sm text-gray-700">
                    Armed Forces personnel (Army, Navy, Air Force) and their
                    dependents are welcome. A valid Service/ESM/Dependent ID
                    must be presented.
                    <strong className="text-green-800">
                      {' '}
                      Available only offline at clinic location.
                    </strong>
                  </p>
                </div>

                {selectedDate && (
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <h2 className="mb-2 text-lg font-semibold text-purple-800">
                      Available Slots for{' '}
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString(
                        'en-IN',
                        {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        },
                      )}
                    </h2>
                    <div className="flex gap-6 text-sm">
                      <div className="flex items-center">
                        <i className="fa-solid fa-laptop mr-2 text-purple-600"></i>
                        <span>
                          <strong>Available Online Slots:</strong>{' '}
                          {availableOnlineSlots} / 10
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label
                    htmlFor="appointment-date"
                    className="mb-2 block text-sm font-medium text-gray-700">
                    Select Date <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => {
                      const input = document.getElementById(
                        'appointment-date',
                      ) as HTMLInputElement;
                      input?.showPicker?.();
                    }}
                    className="cursor-pointer">
                    <input
                      type="date"
                      id="appointment-date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      min={today}
                      max={maxDateString}
                      required
                      className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Bookings available up to 10 days in advance. Closed on
                    Sundays.
                  </p>

                  {/* Available Slots Display */}
                  {selectedDate && (
                    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-calendar-day text-blue-600"></i>
                          <span className="text-sm font-medium text-gray-700">
                            {new Date(
                              selectedDate + 'T00:00:00',
                            ).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i
                            className={`fa-solid fa-circle-check ${
                              availableOnlineSlots > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}></i>
                          <span
                            className={`text-sm font-semibold ${
                              availableOnlineSlots > 0
                                ? 'text-green-700'
                                : 'text-red-700'
                            }`}>
                            {availableOnlineSlots > 0
                              ? `${availableOnlineSlots} ${availableOnlineSlots === 1 ? 'slot' : 'slots'} available`
                              : 'No slots available'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Patient Name */}
                <div>
                  <label
                    htmlFor="patient-name"
                    className="mb-2 block text-sm font-medium text-gray-700">
                    Patient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="patient-name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter patient's full name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Gender Selection */}
                <div>
                  <label
                    htmlFor="patient-gender"
                    className="mb-2 block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="patient-gender"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                {/* Age Input */}
                <div>
                  <label
                    htmlFor="patient-age"
                    className="mb-2 block text-sm font-medium text-gray-700">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="patient-age"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="Enter patient's age"
                    min="1"
                    max="120"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Phone Number Input */}
                <div>
                  <label
                    htmlFor="patient-phone"
                    className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="patient-phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Required for booking confirmation
                  </p>
                </div>

                {/* Message Display */}
                {message && (
                  <div
                    className={`rounded-lg p-4 ${
                      message.type === 'success'
                        ? 'border border-green-200 bg-green-50 text-green-800'
                        : 'border border-red-200 bg-red-50 text-red-800'
                    }`}>
                    <p className="text-sm font-medium">{message.text}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || availableOnlineSlots <= 0}
                  className={`w-full cursor-pointer rounded-lg px-6 py-4 font-semibold text-white transition-all duration-200 ${
                    loading || availableOnlineSlots <= 0
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}>
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <ClipLoader size={20} color="#ffffff" loading={loading} />
                      <span className="ml-2">Processing...</span>
                    </span>
                  ) : availableOnlineSlots <= 0 ? (
                    'No Online Slots Available'
                  ) : (
                    'Book & Pay ₹400'
                  )}
                </button>
              </form>

              {/* Payment Note */}
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-gray-700">
                  <i className="fa-solid fa-credit-card mr-2 text-blue-600"></i>
                  <strong>Online Payment:</strong> Secure payment of ₹400 via
                  Razorpay (UPI, Card, NetBanking, Wallet)
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>

      {/* Alert Modal */}
      <AlertModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />

      {/* Success Modal with Receipt */}
      {showSuccessModal && bookingData && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setBookingData(null);
          }}
          bookingData={bookingData}
        />
      )}
    </div>
  );
};
