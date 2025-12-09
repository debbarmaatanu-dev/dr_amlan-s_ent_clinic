import React, {useState, useEffect, useCallback} from 'react';
import {
  checkAvailableSlots,
  validateBookingAvailability,
  validateDateConstraints,
  initiatePayment,
  type PaymentBookingData,
} from '@/services/appointmentService';
import {AlertModal} from '@/components/AlertModal';
import {SuccessModal} from '@/components/SuccessModal';
import {AppointmentHeader} from '@/components/appointmentComponents/AppointmentHeader';
import {SlotAvailability} from '@/components/appointmentComponents/SlotAvailability';
import {AppointmentForm} from '@/components/appointmentComponents/AppointmentForm';
import {PaymentNote} from '@/components/appointmentComponents/PaymentNote';
import {appStore} from '@/appStore/appStore';
import {PrivacyPolicyLink} from '@/components/appointmentComponents/PrivacyPolicyLink';
import {ImportantNotices} from '@/components/appointmentComponents/ImportantNotices';
import {useTheme} from '@/hooks/useTheme';

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
    if (showModal || showSuccessModal) {
      setMobileNavOpen(true);
    } else {
      setMobileNavOpen(false);
    }
  }, [showModal, showSuccessModal]);

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

  const {actualTheme} = useTheme();

  const bgColor = actualTheme === 'light' ? 'bg-white' : 'bg-gray-800';

  return (
    <div className="flex min-h-screen flex-col">
      <main
        className="flex grow items-center justify-center px-4 py-6 md:py-12 lg:px-8"
        role="main">
        <section className="w-full max-w-7xl">
          <AppointmentHeader />

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
