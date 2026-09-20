import {handleGeoRestrictionError} from '../utils/modalHelpers';
import {logger} from '../utils/logger';
import type {BookingTableData} from '../types/booking';
import {getBearerAuthHeaders} from './authHeaders';

export type AdminBookingsResult =
  | {ok: true; bookings: BookingTableData[]}
  | {ok: false; error: string};

/**
 * Fetch all bookings for a date (admin, bearer token).
 */
export async function fetchAdminBookings(
  date: string,
): Promise<AdminBookingsResult> {
  try {
    const headers = await getBearerAuthHeaders();
    if (!headers) {
      return {
        ok: false,
        error: 'Authentication required. Please log in again.',
      };
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/protected/bookings/${date}`,
      {
        method: 'GET',
        headers,
      },
    );

    const data = await response.json();

    if (data.success && data.bookings) {
      return {ok: true, bookings: data.bookings};
    }

    return {ok: false, error: handleGeoRestrictionError(data)};
  } catch (error) {
    logger.error('Error fetching bookings:', error);
    return {ok: false, error: 'Failed to fetch bookings. Please try again.'};
  }
}
