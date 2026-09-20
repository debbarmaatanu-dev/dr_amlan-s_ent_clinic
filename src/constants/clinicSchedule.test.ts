import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {
  getNavbarScheduleStatus,
  getSaturdayOccurrenceInMonth,
  isBookableClinicDay,
  isClinicOpenAtTime,
  isEveningClinicDay,
  isSecondOrFourthSaturday,
  isWednesday,
  parseDateOnly,
  shouldPinClosedStatusBanner,
  validateBookingDate,
} from './clinicSchedule';

describe('clinicSchedule', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Tuesday 1 Sep 2026, 10:00 local
    jest.setSystemTime(new Date(2026, 8, 1, 10, 0, 0));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('day helpers', () => {
    it('detects Wednesdays and 2nd/4th Saturdays', () => {
      expect(isWednesday(parseDateOnly('2026-09-02'))).toBe(true);
      expect(getSaturdayOccurrenceInMonth(parseDateOnly('2026-09-05'))).toBe(1);
      expect(getSaturdayOccurrenceInMonth(parseDateOnly('2026-09-12'))).toBe(2);
      expect(isSecondOrFourthSaturday(parseDateOnly('2026-09-12'))).toBe(true);
      expect(isSecondOrFourthSaturday(parseDateOnly('2026-09-26'))).toBe(true);
      expect(isSecondOrFourthSaturday(parseDateOnly('2026-09-05'))).toBe(false);
    });

    it('marks evening and bookable clinic days correctly', () => {
      expect(isEveningClinicDay(parseDateOnly('2026-09-01'))).toBe(true); // Tue
      expect(isEveningClinicDay(parseDateOnly('2026-09-06'))).toBe(false); // Sun
      expect(isEveningClinicDay(parseDateOnly('2026-09-02'))).toBe(false); // Wed
      expect(isBookableClinicDay(parseDateOnly('2026-09-06'))).toBe(true); // Sun
      expect(isBookableClinicDay(parseDateOnly('2026-09-12'))).toBe(false); // 2nd Sat
    });
  });

  describe('validateBookingDate', () => {
    it('rejects past dates', () => {
      const result = validateBookingDate('2026-08-31');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/past dates/i);
    });

    it('rejects dates beyond the advance window', () => {
      const result = validateBookingDate('2026-09-20');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/10 days/i);
    });

    it('rejects Wednesday and 2nd/4th Saturday closures', () => {
      expect(validateBookingDate('2026-09-02').isValid).toBe(false);

      // Move "today" so 12 Sep (2nd Saturday) is inside the 10-day window
      jest.setSystemTime(new Date(2026, 8, 8, 10, 0, 0));
      expect(validateBookingDate('2026-09-12').error).toMatch(
        /2nd and 4th Saturday/i,
      );
    });

    it('accepts a valid evening clinic day within the window', () => {
      expect(validateBookingDate('2026-09-03')).toEqual({isValid: true});
    });

    it('rejects same-day evening bookings after 7 PM', () => {
      jest.setSystemTime(new Date(2026, 8, 1, 19, 0, 0));
      const result = validateBookingDate('2026-09-01');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/7:00 PM/i);
    });

    it('rejects same-day Sunday bookings after noon', () => {
      jest.setSystemTime(new Date(2026, 8, 6, 12, 0, 0));
      const result = validateBookingDate('2026-09-06');
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/12:00 PM/i);
    });
  });

  describe('isClinicOpenAtTime / navbar status', () => {
    it('reports open during evening hours on a clinic day', () => {
      const now = new Date(2026, 8, 1, 18, 30, 0);
      expect(isClinicOpenAtTime(now)).toBe(true);
      expect(getNavbarScheduleStatus(now)).toBe('open-evening');
    });

    it('reports closed-wednesday on Wednesdays', () => {
      const now = new Date(2026, 8, 2, 12, 0, 0);
      expect(getNavbarScheduleStatus(now)).toBe('closed-wednesday');
    });

    it('pins closed banner for scheduled closures and admin override', () => {
      expect(shouldPinClosedStatusBanner('closed-wednesday', false)).toBe(true);
      expect(
        shouldPinClosedStatusBanner('closed-second-fourth-saturday', false),
      ).toBe(true);
      expect(shouldPinClosedStatusBanner('closed-off-hours', false)).toBe(
        false,
      );
      expect(shouldPinClosedStatusBanner('open-evening', true)).toBe(true);
    });
  });
});
