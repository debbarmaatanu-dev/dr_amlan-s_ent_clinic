import {db} from './firebase';
import {doc, getDoc, runTransaction} from 'firebase/firestore';

export interface BookingData {
  slotNumber: number;
  name: string;
  gender: string;
  age: number;
  phone: string;
  timestamp: string;
}

interface DayBookings {
  bookings: BookingData[];
}

interface CachedSlots {
  slots: number;
  timestamp: number;
}

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
        console.log(`[Cache HIT] Using cached slots for ${dateString}`);
        return cached.slots;
      }
    }

    // Cache miss or expired - fetch from Firestore
    console.log(`[Cache MISS] Fetching slots from Firestore for ${dateString}`);
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
    console.error('Error checking slots:', error);
    throw error;
  }
};

/**
 * Validate date constraints (not in past, not Sunday, within 10 days)
 */
export const validateDateConstraints = (
  dateString: string,
): {isValid: boolean; error?: string} => {
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

  return {isValid: true};
};

/**
 * Validate if booking is possible before attempting
 * This provides an early check but transaction is still needed for final validation
 */
export const validateBookingAvailability = async (
  dateString: string,
): Promise<{isAvailable: boolean; availableSlots: number; error?: string}> => {
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
    console.error('Error validating booking:', error);
    return {
      isAvailable: false,
      availableSlots: 0,
      error: 'Unable to validate availability. Please try again.',
    };
  }
};

/**
 * Book an appointment for a specific date using Firestore Transaction
 * This prevents race conditions when multiple users book simultaneously
 */
export const bookAppointment = async (
  dateString: string,
  name: string,
  gender: string,
  age: number,
  phone: string,
): Promise<{success: boolean; slotNumber?: number; error?: string}> => {
  try {
    // Sanity check: Validate date constraints before transaction
    const dateValidation = validateDateConstraints(dateString);
    if (!dateValidation.isValid) {
      return {
        success: false,
        error: dateValidation.error,
      };
    }

    // Sanity check: Validate input data
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: 'Patient name is required.',
      };
    }

    if (!gender || !['male', 'female', 'others'].includes(gender)) {
      return {
        success: false,
        error: 'Valid gender selection is required.',
      };
    }

    if (!age || age < 1 || age > 120) {
      return {
        success: false,
        error: 'Valid age (1-120) is required.',
      };
    }

    if (!phone || phone.trim().length === 0) {
      return {
        success: false,
        error: 'Phone number is required.',
      };
    }

    // Validate phone number format (Indian: 10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return {
        success: false,
        error: 'Valid 10-digit phone number is required.',
      };
    }

    const docId = formatDateToDocId(dateString);
    const docRef = doc(db, 'appointment_bookings', docId);

    // Use transaction to ensure atomic read-modify-write
    const result = await runTransaction(db, async transaction => {
      const docSnap = await transaction.get(docRef);

      let bookings: BookingData[] = [];
      let nextSlotNumber = 1;

      if (docSnap.exists()) {
        const data = docSnap.data() as DayBookings;
        bookings = data.bookings || [];

        // Check if slots are still available (critical section)
        if (bookings.length >= 10) {
          throw new Error('NO_SLOTS_AVAILABLE');
        }

        // Sanity check: Ensure bookings array is valid
        if (!Array.isArray(bookings)) {
          throw new Error('INVALID_DATA_STRUCTURE');
        }

        // Find next slot number
        const maxSlot = bookings.reduce(
          (max, b) => Math.max(max, b.slotNumber),
          0,
        );
        nextSlotNumber = maxSlot + 1;
      }

      const newBooking: BookingData = {
        slotNumber: nextSlotNumber,
        name: name.trim(),
        gender,
        age,
        phone: phone.trim(),
        timestamp: new Date().toISOString(),
      };

      bookings.push(newBooking);

      // Atomic write - this will fail if document was modified by another transaction
      transaction.set(docRef, {bookings});

      return {success: true, slotNumber: nextSlotNumber};
    });

    // Clear cache for this date after successful booking
    if (result.success) {
      clearSlotCache(dateString);
      console.log(
        `[Cache CLEAR] Cleared cache for ${dateString} after booking`,
      );
    }

    return result;
  } catch (error: unknown) {
    console.error('Error booking appointment:', error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message === 'NO_SLOTS_AVAILABLE') {
        return {
          success: false,
          error:
            'No online slots available. Another user may have just booked the last slot.',
        };
      }

      if (error.message === 'INVALID_DATA_STRUCTURE') {
        return {
          success: false,
          error:
            'Data integrity issue detected. Please contact support or try again.',
        };
      }
    }

    return {
      success: false,
      error: 'Failed to book appointment. Please try again.',
    };
  }
};
