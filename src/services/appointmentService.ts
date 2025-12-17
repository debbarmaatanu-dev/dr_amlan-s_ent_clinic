import {db} from './firebase';
import {doc, getDoc} from 'firebase/firestore';
import type {
  DayBookings,
  CachedSlots,
  DateValidationResult,
  BookingAvailabilityResult,
  PaymentInitiationResponse,
} from '../types/types';
import {logger} from '../utils/logger';

// Re-export types for backward compatibility
export type {PaymentBookingData, BookingData} from '../types/types';

// Client-side cache for slot availability (30 second TTL)
const slotsCache = new Map<string, CachedSlots>();
const CACHE_TTL = 30000; // 30 seconds in milliseconds

/**
 * Clear expired cache entries
 */
const clearExpiredCache = (): void => {
  const now = Date.now();
  const keysToDelete: string[] = [];

  slotsCache.forEach((value, key) => {
    if (now - value.timestamp > CACHE_TTL) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => slotsCache.delete(key));
};

/**
 * Clear cache for a specific date (used after booking)
 */
export const clearSlotCache = (dateString: string): void => {
  slotsCache.delete(dateString);
};

/**
 * Clear all cache entries
 */
export const clearAllSlotCache = (): void => {
  slotsCache.clear();
};

/**
 * Format date string from YYYY-MM-DD to DD-MM-YYYY for Firestore document ID
 */
export const formatDateToDocId = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

/**
 * Check available online slots for a specific date (with caching)
 */
export const checkAvailableSlots = async (
  dateString: string,
  forceRefresh = false,
): Promise<number> => {
  try {
    // Clear expired cache entries periodically
    clearExpiredCache();

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = slotsCache.get(dateString);
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_TTL) {
        // Cache hit - return cached value
        logger.log(`[Cache HIT] Using cached slots for ${dateString}`);
        return cached.slots;
      }
    }

    // Cache miss or expired - fetch from Firestore
    logger.log(`[Cache MISS] Fetching slots from Firestore for ${dateString}`);
    const docId = formatDateToDocId(dateString);
    const docRef = doc(db, 'appointment_bookings', docId);
    const docSnap = await getDoc(docRef);

    let availableSlots: number;

    if (docSnap.exists()) {
      const data = docSnap.data() as DayBookings;
      const bookings = data.bookings || [];
      const onlineCount = bookings.length;
      availableSlots = 10 - onlineCount;
    } else {
      availableSlots = 10;
    }

    // Update cache
    slotsCache.set(dateString, {
      slots: availableSlots,
      timestamp: Date.now(),
    });

    return availableSlots;
  } catch (error) {
    logger.error('Error checking slots:', error);
    throw error;
  }
};

/**
 * Validate date constraints (not in past, not Sunday, within 10 days, not after 8 PM for today)
 */
export const validateDateConstraints = (
  dateString: string,
): DateValidationResult => {
  const selectedDate = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if date is in the past
  if (selectedDate < today) {
    return {
      isValid: false,
      error:
        'Cannot book appointments for past dates. Please select today or a future date.',
    };
  }

  // Check if date is more than 10 days in advance
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 10);

  if (selectedDate > maxDate) {
    return {
      isValid: false,
      error:
        'Appointments can only be booked up to 10 days in advance. Please select an earlier date.',
    };
  }

  // Check if selected date is Sunday (day 0)
  if (selectedDate.getDay() === 0) {
    return {
      isValid: false,
      error: 'Clinic is closed on Sundays. Please select another date.',
    };
  }

  // Check if booking for today after 7 PM
  const now = new Date();
  const currentHour = now.getHours();
  const isToday =
    selectedDate.getDate() === now.getDate() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear();

  if (isToday && currentHour >= 19) {
    return {
      isValid: false,
      error:
        'Bookings for today are closed after 7 PM. Please select a future date.',
    };
  }

  return {isValid: true};
};

/**
 * Validate if booking is possible before attempting
 * This provides an early check but transaction is still needed for final validation
 */
export const validateBookingAvailability = async (
  dateString: string,
): Promise<BookingAvailabilityResult> => {
  try {
    // First validate date constraints
    const dateValidation = validateDateConstraints(dateString);
    if (!dateValidation.isValid) {
      return {
        isAvailable: false,
        availableSlots: 0,
        error: dateValidation.error,
      };
    }

    const availableSlots = await checkAvailableSlots(dateString);

    if (availableSlots <= 0) {
      return {
        isAvailable: false,
        availableSlots: 0,
        error: 'No slots available for this date.',
      };
    }

    return {
      isAvailable: true,
      availableSlots,
    };
  } catch (error) {
    logger.error('Error validating booking:', error);
    return {
      isAvailable: false,
      availableSlots: 0,
      error: 'Unable to validate availability. Please try again.',
    };
  }
};

/**
 * Initiate payment via backend using PhonePe (redirect approach)
 */
export const initiatePayment = async (
  date: string,
  name: string,
  gender: string,
  age: number,
  phone: string,
): Promise<PaymentInitiationResponse> => {
  try {
    // Step 1: Create payment order on backend
    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/payment/create-order`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({date, name, gender, age, phone, amount: 400}),
      },
    );

    const data = await response.json();
    logger.log('Backend response:', data);

    if (!data.success) {
      // Handle geolocation restriction specifically
      if (data.code === 'GEO_RESTRICTED') {
        return {
          success: false,
          error:
            'This service is only available in India. Please contact us if you believe this is an error.',
        };
      }

      // Handle clinic closed by admin
      if (data.code === 'CLINIC_CLOSED') {
        return {
          success: false,
          error: data.error || 'Clinic bookings are temporarily closed.',
        };
      }

      return {success: false, error: data.error};
    }

    // Step 2: Redirect to PhonePe payment page
    logger.log('Redirecting to PhonePe:', data.redirectUrl);
    window.location.href = data.redirectUrl;

    // This won't be reached due to redirect, but needed for TypeScript
    return {success: true};
  } catch (error) {
    logger.error('Payment initiation error:', error);
    return {success: false, error: 'Failed to initiate payment'};
  }
};
