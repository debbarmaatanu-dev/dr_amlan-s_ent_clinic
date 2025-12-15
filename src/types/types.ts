/**
 * Frontend Types for Dr. Amlan's ENT Clinic
 * Centralized type definitions to ensure consistency
 */

/**
 * Complete booking data structure (matches backend BookingData)
 */
export interface BookingData {
  slotNumber: number;
  name: string;
  gender: string;
  age: number;
  phone: string;
  paymentId: string;
  orderId: string;
  amount: number;
  paymentStatus: string;
  paymentMethod?: string;
  paymentDetails?: {
    vpa?: string;
    bank?: string;
    wallet?: string;
    cardId?: string;
  };
  timestamp: string;
}

/**
 * Payment booking data for receipts and UI display
 */
export interface PaymentBookingData {
  slotNumber: number;
  date: string;
  name: string;
  gender: string;
  age: number;
  phone: string;
  amount: number;
  paymentId: string;
  orderId: string;
  paymentMethod?: string;
  paymentStatus?: string;
  refundInfo?: {
    refundId?: string;
    status?: string;
    reason?: string;
  };
}

/**
 * Booking data for PDF generation
 */
export interface PDFBookingData {
  slotNumber: number;
  date: string;
  name: string;
  phone: string;
}

/**
 * Day bookings structure from Firestore
 */
export interface DayBookings {
  bookings: BookingData[];
}

/**
 * Cached slots structure for client-side caching
 */
export interface CachedSlots {
  slots: number;
  timestamp: number;
}

/**
 * API response for appointment search
 */
export interface AppointmentSearchResponse {
  success: boolean;
  booking?: PaymentBookingData;
  bookings?: PaymentBookingData[];
  multiple?: boolean;
  totalBookings?: number;
  message?: string;
  error?: string;
}

/**
 * API response for admin bookings
 */
export interface AdminBookingsResponse {
  success: boolean;
  bookings?: PaymentBookingData[];
  totalBookings?: number;
  date?: string;
  message?: string;
  error?: string;
}

/**
 * Payment initiation response
 */
export interface PaymentInitiationResponse {
  success: boolean;
  error?: string;
  bookingData?: PaymentBookingData;
}

/**
 * Date validation result
 */
export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Booking availability result
 */
export interface BookingAvailabilityResult {
  isAvailable: boolean;
  availableSlots: number;
  error?: string;
}
