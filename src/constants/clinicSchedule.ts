/**
 * Clinic schedule — single source of truth for booking rules and display copy.
 *
 * Open days:
 * - Mon, Tue, Thu, Fri: 6:00 PM – 8:30 PM
 * - Sat (except 2nd & 4th): 6:00 PM – 8:30 PM
 * - Sun: 10:30 AM – 1:00 PM
 *
 * Closed:
 * - Every Wednesday
 * - 2nd and 4th Saturday of each month
 *
 * Admin manual override (clinic_control) is handled separately.
 */

export const EVENING_OPEN_MINUTES = 18 * 60; // 6:00 PM
export const EVENING_CLOSE_MINUTES = 20 * 60 + 30; // 8:30 PM
export const SUNDAY_OPEN_MINUTES = 10 * 60 + 30; // 10:30 AM
export const SUNDAY_CLOSE_MINUTES = 13 * 60; // 1:00 PM
export const SAME_DAY_EVENING_CUTOFF_HOUR = 19; // 7:00 PM
/** Same-day Sunday booking stops at noon; clinic session runs until 1:00 PM */
export const SAME_DAY_SUNDAY_CUTOFF_HOUR = 12; // 12:00 PM
export const BOOKING_ADVANCE_DAYS = 10;

/** Display copy — use everywhere timings are shown to patients */
export const CLINIC_HOURS_EVENING = '6:00 PM – 8:30 PM';
export const CLINIC_HOURS_SUNDAY = '10:30 AM – 1:00 PM';

export const CLINIC_SCHEDULE_EXCEPT_SATURDAYS = '(except 2nd & 4th Saturday)';

export const CLINIC_SCHEDULE_OPEN_PART = `Mon, Tue, Thu, Fri & Sat ${CLINIC_SCHEDULE_EXCEPT_SATURDAYS}: ${CLINIC_HOURS_EVENING}. Sunday: ${CLINIC_HOURS_SUNDAY}.`;

export const CLINIC_SCHEDULE_CLOSURE_SUMMARY =
  'Closed every Wednesday and on 2nd & 4th Saturdays of each month.';

export const CLINIC_SCHEDULE_SUMMARY = `${CLINIC_SCHEDULE_OPEN_PART} ${CLINIC_SCHEDULE_CLOSURE_SUMMARY}`;

export const CLINIC_SCHEDULE_BULLET_LINES = [
  `Evening clinic: ${CLINIC_HOURS_EVENING} (Monday, Tuesday, Thursday, Friday, and Saturdays except 2nd & 4th)`,
  `Sunday clinic: ${CLINIC_HOURS_SUNDAY}`,
  'Closed every Wednesday',
  'Closed on the 2nd and 4th Saturday of each month',
] as const;

export function parseDateOnly(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

export function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

export function isWednesday(date: Date): boolean {
  return date.getDay() === 3;
}

/** 1-based Saturday index within the month (1st Sat, 2nd Sat, …) */
export function getSaturdayOccurrenceInMonth(date: Date): number | null {
  if (date.getDay() !== 6) return null;
  let count = 0;
  for (let d = 1; d <= date.getDate(); d++) {
    const probe = new Date(date.getFullYear(), date.getMonth(), d);
    if (probe.getDay() === 6) count++;
  }
  return count;
}

export function isSecondOrFourthSaturday(date: Date): boolean {
  const occurrence = getSaturdayOccurrenceInMonth(date);
  return occurrence === 2 || occurrence === 4;
}

export function isScheduledClosureDay(date: Date): boolean {
  return isWednesday(date) || isSecondOrFourthSaturday(date);
}

/** Mon/Tue/Thu/Fri and non-closure Saturdays */
export function isEveningClinicDay(date: Date): boolean {
  if (isSunday(date) || isScheduledClosureDay(date)) return false;
  const day = date.getDay();
  return day >= 1 && day <= 6;
}

export function isBookableClinicDay(date: Date): boolean {
  return isSunday(date) || isEveningClinicDay(date);
}

export function getScheduledClosureReason(date: Date): string | null {
  if (isWednesday(date)) {
    return 'Clinic is closed every Wednesday. Please select another date.';
  }
  if (isSecondOrFourthSaturday(date)) {
    return 'Clinic is closed on the 2nd and 4th Saturday of each month. Please select another date.';
  }
  return null;
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Validates whether a date may be booked (excludes admin override — check that separately).
 */
export function validateBookingDate(dateString: string): {
  isValid: boolean;
  error?: string;
} {
  const selectedDate = parseDateOnly(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return {
      isValid: false,
      error:
        'Cannot book appointments for past dates. Please select today or a future date.',
    };
  }

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + BOOKING_ADVANCE_DAYS);

  if (selectedDate > maxDate) {
    return {
      isValid: false,
      error: `Appointments can only be booked up to ${BOOKING_ADVANCE_DAYS} days in advance. Please select an earlier date.`,
    };
  }

  const closureReason = getScheduledClosureReason(selectedDate);
  if (closureReason) {
    return {isValid: false, error: closureReason};
  }

  if (!isBookableClinicDay(selectedDate)) {
    return {
      isValid: false,
      error: 'Clinic is not open on this date. Please select another date.',
    };
  }

  const now = new Date();
  if (isSameCalendarDay(selectedDate, now)) {
    if (isSunday(selectedDate)) {
      if (now.getHours() >= SAME_DAY_SUNDAY_CUTOFF_HOUR) {
        return {
          isValid: false,
          error:
            'Bookings for today are closed after 12:00 PM on Sundays. Please select a future date.',
        };
      }
    } else if (now.getHours() >= SAME_DAY_EVENING_CUTOFF_HOUR) {
      return {
        isValid: false,
        error:
          'Bookings for today are closed after 7:00 PM. Please select a future date.',
      };
    }
  }

  return {isValid: true};
}

/** Whether the clinic is within operating hours right now (default schedule only). */
export function isClinicOpenAtTime(now: Date): boolean {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (isScheduledClosureDay(today)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (isSunday(today)) {
    return (
      currentMinutes >= SUNDAY_OPEN_MINUTES &&
      currentMinutes <= SUNDAY_CLOSE_MINUTES
    );
  }

  if (isEveningClinicDay(today)) {
    return (
      currentMinutes >= EVENING_OPEN_MINUTES &&
      currentMinutes <= EVENING_CLOSE_MINUTES
    );
  }

  return false;
}

export function getConsultationHoursLabelForDate(dateString: string): string {
  return isSunday(parseDateOnly(dateString))
    ? CLINIC_HOURS_SUNDAY
    : CLINIC_HOURS_EVENING;
}

export type NavbarScheduleStatus =
  | 'open-sunday'
  | 'open-evening'
  | 'closed-wednesday'
  | 'closed-second-fourth-saturday'
  | 'closed-off-hours'
  | 'closed-sunday-off-hours';

export function getNavbarScheduleStatus(now: Date): NavbarScheduleStatus {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  if (isWednesday(today)) return 'closed-wednesday';
  if (isSecondOrFourthSaturday(today)) return 'closed-second-fourth-saturday';

  if (isClinicOpenAtTime(now)) {
    return isSunday(today) ? 'open-sunday' : 'open-evening';
  }

  return isSunday(today) ? 'closed-sunday-off-hours' : 'closed-off-hours';
}

/** Keep the top info banner visible (sticky with nav) on full closure days */
export function shouldPinClosedStatusBanner(
  scheduleStatus: NavbarScheduleStatus,
  isManuallyOverridden: boolean,
): boolean {
  if (isManuallyOverridden) return true;
  return (
    scheduleStatus === 'closed-wednesday' ||
    scheduleStatus === 'closed-second-fourth-saturday'
  );
}
