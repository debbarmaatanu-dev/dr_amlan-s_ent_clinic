import React, {useState, useEffect, useCallback, Suspense, lazy} from 'react';
import {
  checkAvailableSlots,
  validateBookingAvailability,
  validateDateConstraints,
  initiatePayment,
} from '@/services/appointmentService';
import type {PaymentBookingData} from '@/types/types';
import {AlertModal} from '@/components/AlertModal';
import {SuccessModal} from '@/components/SuccessModal';
import {useSEO} from '@/hooks/useSEO';

import {AppointmentHeader} from '@/components/appointmentComponents/AppointmentHeader';
import {SlotAvailability} from '@/components/appointmentComponents/SlotAvailability';
import {AppointmentForm} from '@/components/appointmentComponents/AppointmentForm';
import {logger} from '@/utils/logger';
import {PaymentNote} from '@/components/appointmentComponents/PaymentNote';
import {appStore} from '@/appStore/appStore';
import {PrivacyPolicyLink} from '@/components/appointmentComponents/PrivacyPolicyLink';
import {ImportantNotices} from '@/components/appointmentComponents/ImportantNotices';
// Lazy load heavy components (only loaded when needed)
const SearchAppointmentModal = lazy(() =>
  import('@/components/SearchAppointmentModal').then(module => ({
    default: module.SearchAppointmentModal,
  })),
);
const AdminDownloadModal = lazy(() =>
  import('@/components/AdminDownloadModal').then(module => ({
    default: module.AdminDownloadModal,
  })),
);
const AdminControlModal = lazy(() =>
  import('@/components/AdminControlModal').then(module => ({
    default: module.AdminControlModal,
  })),
);
import {useTheme} from '@/hooks/useTheme';
import {useClinicStatus} from '@/hooks/useClinicStatus';

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
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showControlModal, setShowControlModal] = useState<boolean>(false);

  // SEO optimization for appointment page
  useSEO();

  // Get user from store for admin check
  const user = appStore(state => state.user);

  // Get clinic status (fetched by Navbar - always mounted)
  const {isClinicClosed} = useClinicStatus();

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Calculate max date (10 days from today)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 10);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Check for payment callback on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const transactionId = urlParams.get('transaction_id');

    if (paymentStatus === 'callback' && transactionId) {
      // Handle PhonePe callback
      void handlePaymentCallback(transactionId);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle PhonePe payment callback
  const handlePaymentCallback = async (transactionId: string) => {
    setLoading(true);

    try {
      // First check if webhook already processed this transaction (faster)
      const webhookResponse = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/payment/webhook-status/${transactionId}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );

      const webhookData = await webhookResponse.json();

      // If webhook processed, use that result (real-time)
      if (webhookData.success && webhookData.webhookProcessed) {
        if (webhookData.eventType === 'CHECKOUT_ORDER_COMPLETED') {
          // Webhook confirmed success - get booking details
          const response = await fetch(
            `${import.meta.env.VITE_API_BACKEND_URL}/api/payment/status-by-transaction/${transactionId}`,
            {
              method: 'GET',
              headers: {'Content-Type': 'application/json'},
            },
          );

          const data = await response.json();
          if (data.success && data.status === 'SUCCESS') {
            const bookingData: PaymentBookingData = {
              slotNumber: data.slotNumber,
              date: data.date,
              name: data.name,
              gender: data.bookingData.gender,
              age: data.bookingData.age,
              phone: data.bookingData.phone,
              amount: 400,
              paymentId: transactionId,
              orderId: transactionId,
            };

            setBookingData(bookingData);
            setShowSuccessModal(true);
            await fetchAvailableSlots(data.date, true);
            setLoading(false);
            return;
          }
        } else if (webhookData.eventType === 'CHECKOUT_ORDER_FAILED') {
          // Webhook confirmed failure
          setModalContent({
            title: 'Payment Failed',
            message: 'Payment was not successful. Please try again.',
            type: 'error',
          });
          setShowModal(true);
          setLoading(false);
          return;
        }
      }

      // Fallback to API status check if webhook not processed yet
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/payment/status-by-transaction/${transactionId}`,
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
        },
      );

      const data = await response.json();

      if (data.success && data.status === 'SUCCESS') {
        // Payment successful - create booking data for receipt display
        const bookingData: PaymentBookingData = {
          slotNumber: data.slotNumber,
          date: data.date,
          name: data.name,
          gender: data.bookingData.gender,
          age: data.bookingData.age,
          phone: data.bookingData.phone,
          amount: 400,
          paymentId: transactionId,
          orderId: transactionId,
        };

        setBookingData(bookingData);
        setShowSuccessModal(true);

        // Refresh slots for the booking date
        await fetchAvailableSlots(data.date, true);
      } else {
        // Payment failed
        setModalContent({
          title: 'Payment Failed',
          message:
            data.error || 'Payment was not successful. Please try again.',
          type: 'error',
        });
        setShowModal(true);
      }
    } catch (error) {
      logger.error('Error checking payment callback:', error);
      setModalContent({
        title: 'Payment Error',
        message:
          'Unable to verify payment status. Please contact support if money was deducted.',
        type: 'error',
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = useCallback(
    async (dateString: string, forceRefresh = false) => {
      try {
        const availableSlots = await checkAvailableSlots(
          dateString,
          forceRefresh,
        );
        setAvailableOnlineSlots(availableSlots);
      } catch (error) {
        logger.error('Error checking slots:', error);
        setAvailableOnlineSlots(10);
      }
    },
    [],
  );

  // URL parameter handling is done in useEffect above for redirect flow

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
      void fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, fetchAvailableSlots]);

  useEffect(() => {
    if (showModal || showSuccessModal) {
      setMobileNavOpen(true);
    } else {
      setMobileNavOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, showSuccessModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if clinic is manually closed first
    if (isClinicClosed) {
      // Form component will show clinic closed message below button
      return;
    }

    // Basic validation (form component handles detailed validation)
    if (!selectedDate || !name.trim() || !gender || !age || !phone.trim()) {
      // Form component will show field-level errors
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      // Form component will show field-level errors
      return;
    }

    // Validate phone number (Indian format: 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      // Form component will show field-level errors
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
      // Form component will show no slots message below button
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

      // Step 2: Initiate payment (will redirect to PhonePe)
      const result = await initiatePayment(
        selectedDate,
        name,
        gender,
        ageNum,
        phone,
      );

      // If we reach here, there was an error (redirect should have happened)
      if (!result.success) {
        const errorMessage =
          result.error || 'Failed to initiate payment. Please try again.';

        // Show modal
        setModalContent({
          title: 'Payment Failed',
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
      logger.error('Error booking appointment:', error);
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

  const {actualTheme} = useTheme();

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';

  return (
    <div className="flex min-h-screen flex-col">
      <main
        className="flex grow items-center justify-center px-4 py-6 md:py-12 lg:px-8"
        role="main">
        <section className="w-full max-w-7xl">
          <AppointmentHeader />

          {/* Search Appointment Button */}
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setShowSearchModal(true)}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-blue-700">
              <i className="fa-solid fa-search mr-2"></i>
              Search Appointment/Receipt
            </button>
          </div>

          <article
            className={`mx-auto w-full max-w-4xl overflow-hidden rounded-2xl ${bgColor} shadow-xl`}>
            <div className="p-8 md:p-12">
              {/* Error/Success Message */}
              {message && (
                <div
                  className={`mb-6 rounded-lg p-4 ${
                    message.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                  {message.text}
                </div>
              )}

              {/* Important Information Boxes - Above Form */}
              <ImportantNotices />

              {/* Slot Availability */}
              <SlotAvailability
                availableSlots={availableOnlineSlots}
                selectedDate={selectedDate}
              />

              {/* Appointment Form */}
              <AppointmentForm
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                name={name}
                setName={setName}
                gender={gender}
                setGender={setGender}
                age={age}
                setAge={setAge}
                phone={phone}
                setPhone={setPhone}
                loading={loading}
                availableSlots={availableOnlineSlots}
                onSubmit={handleSubmit}
                today={today}
                maxDate={maxDateString}
              />

              {/* Payment Note */}
              <PaymentNote />

              {/* Privacy Policy Link */}
              <PrivacyPolicyLink />

              {/* Admin Download Button */}
              {(() => {
                const allowedAdminEmails: string[] = [
                  import.meta.env.VITE_FIREBASE_ADMIN_EMAIL1,
                  import.meta.env.VITE_FIREBASE_ADMIN_EMAIL2,
                ];
                const isAdmin = allowedAdminEmails.includes(user?.email || '');

                if (isAdmin) {
                  return (
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setShowControlModal(true)}
                        className="cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-blue-700">
                        <i className="fa-solid fa-pen mr-2"></i>
                        Control Appointments
                      </button>
                      <button
                        onClick={() => setShowAdminModal(true)}
                        className="cursor-pointer rounded-lg bg-green-600 px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-green-700">
                        <i className="fa-solid fa-download mr-2"></i>
                        Download Bookings
                      </button>
                    </div>
                  );
                }
                return null;
              })()}
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

      {/* Search Appointment Modal */}
      {showSearchModal && (
        <Suspense
          fallback={
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
            </div>
          }>
          <SearchAppointmentModal
            isOpen={showSearchModal}
            onClose={() => setShowSearchModal(false)}
          />
        </Suspense>
      )}

      {/* Admin Download Modal */}
      {showAdminModal && (
        <Suspense
          fallback={
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
            </div>
          }>
          <AdminDownloadModal
            isOpen={showAdminModal}
            onClose={() => setShowAdminModal(false)}
          />
        </Suspense>
      )}

      {/* Admin Control Modal */}
      {showControlModal && (
        <Suspense
          fallback={
            <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
            </div>
          }>
          <AdminControlModal
            isOpen={showControlModal}
            onClose={() => setShowControlModal(false)}
          />
        </Suspense>
      )}
    </div>
  );
};
