import {describe, expect, it} from '@jest/globals';
import {
  isManuallyClosedOnDate,
  validateClinicClosureDates,
} from './clinicControlHelpers';

describe('clinicControlHelpers', () => {
  describe('validateClinicClosureDates', () => {
    it('requires closedFrom and ordered dates', () => {
      expect(validateClinicClosureDates('', '')).toBe(
        'Please select a "Closed From" date',
      );
      expect(validateClinicClosureDates('2026-09-05', '2026-09-03')).toBe(
        '"Closed Till" date must be after "Closed From" date',
      );
      expect(validateClinicClosureDates('2026-09-03', '2026-09-05')).toBeNull();
      expect(validateClinicClosureDates('2026-09-03', '')).toBeNull();
    });
  });

  describe('isManuallyClosedOnDate', () => {
    it('is false without a manual override window', () => {
      expect(isManuallyClosedOnDate(null, '2026-09-03')).toBe(false);
      expect(
        isManuallyClosedOnDate(
          {isManuallyOverridden: false, closedFrom: '2026-09-01'},
          '2026-09-03',
        ),
      ).toBe(false);
    });

    it('detects open-ended and ranged closures', () => {
      expect(
        isManuallyClosedOnDate(
          {
            isManuallyOverridden: true,
            closedFrom: '2026-09-01',
          },
          '2026-09-10',
        ),
      ).toBe(true);

      expect(
        isManuallyClosedOnDate(
          {
            isManuallyOverridden: true,
            closedFrom: '2026-09-01',
            closedTill: '2026-09-05',
          },
          '2026-09-03',
        ),
      ).toBe(true);

      expect(
        isManuallyClosedOnDate(
          {
            isManuallyOverridden: true,
            closedFrom: '2026-09-01',
            closedTill: '2026-09-05',
          },
          '2026-09-06',
        ),
      ).toBe(false);
    });
  });
});
