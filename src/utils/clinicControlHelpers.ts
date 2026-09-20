export interface ManualClinicClosureStatus {
  isManuallyOverridden: boolean;
  closedFrom?: string;
  closedTill?: string;
}

/**
 * Validate admin "close bookings" date inputs before calling the API.
 */
export function validateClinicClosureDates(
  closedFrom: string,
  closedTill: string,
): string | null {
  if (!closedFrom) {
    return 'Please select a "Closed From" date';
  }

  if (closedTill && closedFrom > closedTill) {
    return '"Closed Till" date must be after "Closed From" date';
  }

  return null;
}

/**
 * Whether manual override closes bookings on the given YYYY-MM-DD day.
 */
export function isManuallyClosedOnDate(
  status: ManualClinicClosureStatus | null | undefined,
  today: string,
): boolean {
  if (!status?.isManuallyOverridden || !status.closedFrom) {
    return false;
  }

  if (status.closedFrom <= today) {
    if (!status.closedTill || status.closedTill >= today) {
      return true;
    }
  }

  return false;
}
