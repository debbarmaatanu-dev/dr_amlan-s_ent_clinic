/**
 * Temporary PhonePe / payment-gateway kill switch.
 * Set to `false` when KYC/gateway is restored to re-enable online payments.
 */
export const PAYMENTS_TEMPORARILY_DISABLED = true;

export const PAYMENTS_OUTAGE_TITLE = 'Online payments temporarily unavailable';

export const PAYMENTS_OUTAGE_USER_MESSAGE =
  'Online appointment payments are temporarily blocked due to a technical issue with the payment gateway. Please try again later, or visit the clinic to book.';

export const PAYMENTS_OUTAGE_CONTACT_HINT =
  'Call or WhatsApp +91 6033521499 for appointment assistance.';
