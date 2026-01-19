/**
 * Utility functions for modal operations
 */

/**
 * Handles geolocation restriction errors consistently across modals
 */
export const handleGeoRestrictionError = (data: any): string => {
  if (data.code === 'GEO_RESTRICTED') {
    return 'This service is only available in India. Please contact us if you believe this is an error.';
  }
  return data.error || 'An error occurred. Please try again.';
};

/**
 * Validates Indian phone number format
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Common modal close handler that resets all states
 */
export const createModalCloseHandler = (
  resetFunctions: Array<() => void>,
  onClose: () => void,
) => {
  return () => {
    resetFunctions.forEach(fn => fn());
    onClose();
  };
};
