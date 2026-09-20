import {
  resolvePaymentCallback,
  type PaymentCallbackResult,
} from '@/services/appointmentService';

let inFlightId: string | null = null;
let inFlight: Promise<PaymentCallbackResult> | null = null;

/** Test-only reset between cases. */
export function resetPaymentCallbackSessionForTests(): void {
  inFlightId = null;
  inFlight = null;
}

/** Pure URL parse — safe in useState initializers (no history mutation). */
export function readPaymentCallbackIdFromUrl(
  search: string = window.location.search,
): string | null {
  const params = new URLSearchParams(search);
  if (params.get('payment') !== 'callback') {
    return null;
  }
  return params.get('transaction_id');
}

/** Clear PhonePe callback query params. Idempotent if already cleaned. */
export function clearPaymentCallbackSearchParams(): void {
  const params = new URLSearchParams(window.location.search);
  if (params.get('payment') !== 'callback') {
    return;
  }
  window.history.replaceState({}, document.title, window.location.pathname);
}

/**
 * Single-flight resolver for one transaction id.
 * Survives React Strict Mode effect setup → cleanup → setup without a
 * second backend call.
 */
export function resolvePaymentCallbackOnce(
  transactionId: string,
  resolve: (
    transactionId: string,
  ) => Promise<PaymentCallbackResult> = resolvePaymentCallback,
): Promise<PaymentCallbackResult> {
  if (inFlight && inFlightId === transactionId) {
    return inFlight;
  }
  inFlightId = transactionId;
  inFlight = resolve(transactionId);
  return inFlight;
}
