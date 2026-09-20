import {logger} from '../utils/logger';
import {getBearerAuthHeaders} from './authHeaders';

export interface ProtectedClinicStatus {
  isManuallyOverridden: boolean;
  closedFrom?: string;
  closedTill?: string;
  message?: string;
}

export type ProtectedClinicStatusResult =
  | {ok: true; status: ProtectedClinicStatus}
  | {ok: false; error?: string; authRequired?: boolean};

export type AdminActionResult =
  | {ok: true; message: string}
  | {ok: false; error: string; authRequired?: boolean};

/**
 * GET /api/protected/clinic-status
 */
export async function fetchProtectedClinicStatus(): Promise<ProtectedClinicStatusResult> {
  try {
    const headers = await getBearerAuthHeaders();
    if (!headers) {
      return {ok: false, authRequired: true, error: 'Authentication required'};
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/protected/clinic-status`,
      {method: 'GET', headers},
    );

    const data = await response.json();
    if (data.success) {
      return {ok: true, status: data.status};
    }

    return {ok: false, error: data.error || 'Failed to fetch clinic status'};
  } catch (error) {
    logger.error('Error fetching clinic status:', error);
    return {ok: false, error: 'Failed to fetch clinic status'};
  }
}

/**
 * POST /api/protected/control-clinic
 */
export async function controlClinicClosure(
  closedFrom: string,
  closedTill: string | null,
): Promise<AdminActionResult> {
  try {
    const headers = await getBearerAuthHeaders();
    if (!headers) {
      return {ok: false, authRequired: true, error: 'Authentication required'};
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/protected/control-clinic`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          closedFrom,
          closedTill,
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      return {
        ok: true,
        message: closedTill
          ? `Clinic bookings closed from ${closedFrom} to ${closedTill}`
          : `Clinic bookings closed from ${closedFrom} until manually reopened`,
      };
    }

    return {ok: false, error: data.error || 'Failed to update clinic status'};
  } catch (error) {
    logger.error('Error updating clinic status:', error);
    return {
      ok: false,
      error: 'Failed to update clinic status. Please try again.',
    };
  }
}

/**
 * POST /api/protected/turn-on-clinic
 */
export async function turnOnClinicBookings(): Promise<AdminActionResult> {
  try {
    const headers = await getBearerAuthHeaders();
    if (!headers) {
      return {ok: false, authRequired: true, error: 'Authentication required'};
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/protected/turn-on-clinic`,
      {
        method: 'POST',
        headers,
      },
    );

    const data = await response.json();

    if (data.success) {
      return {ok: true, message: 'Clinic bookings turned on for today'};
    }

    return {ok: false, error: data.error || 'Failed to turn on clinic'};
  } catch (error) {
    logger.error('Error turning on clinic:', error);
    return {ok: false, error: 'Failed to turn on clinic. Please try again.'};
  }
}
