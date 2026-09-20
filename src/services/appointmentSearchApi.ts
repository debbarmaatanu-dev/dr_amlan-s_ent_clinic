import type {BookingTableData} from '../types/booking';
import type {PaymentBookingData} from '../types/types';
import {handleGeoRestrictionError} from '../utils/modalHelpers';
import {logger} from '../utils/logger';

export type SearchAppointmentsResult =
  | {ok: true; multiple: true; bookings: BookingTableData[]}
  | {ok: true; multiple: false; booking: PaymentBookingData}
  | {ok: false; error: string};

/**
 * Search appointments by phone + date via backend.
 */
export async function searchAppointments(
  phone: string,
  date: string,
): Promise<SearchAppointmentsResult> {
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
        return {ok: true, multiple: true, bookings: data.bookings};
      }
      return {ok: true, multiple: false, booking: data.booking};
    }

    return {ok: false, error: handleGeoRestrictionError(data)};
  } catch (error) {
    logger.error('Error searching appointment:', error);
    return {
      ok: false,
      error: 'Failed to search appointment. Please try again.',
    };
  }
}
