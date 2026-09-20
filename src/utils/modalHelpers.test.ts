import {describe, expect, it, jest} from '@jest/globals';
import {
  createModalCloseHandler,
  handleGeoRestrictionError,
  validatePhoneNumber,
} from './modalHelpers';

describe('modalHelpers', () => {
  describe('handleGeoRestrictionError', () => {
    it('returns the India-only message for GEO_RESTRICTED', () => {
      expect(handleGeoRestrictionError({code: 'GEO_RESTRICTED'})).toMatch(
        /only available in India/i,
      );
    });

    it('falls back to the API error or a generic message', () => {
      expect(handleGeoRestrictionError({error: 'Bad request'})).toBe(
        'Bad request',
      );
      expect(handleGeoRestrictionError({})).toBe(
        'An error occurred. Please try again.',
      );
    });
  });

  describe('validatePhoneNumber', () => {
    it('accepts valid Indian mobile numbers', () => {
      expect(validatePhoneNumber('9876543210')).toBe(true);
      expect(validatePhoneNumber('6123456789')).toBe(true);
    });

    it('rejects invalid numbers', () => {
      expect(validatePhoneNumber('5876543210')).toBe(false);
      expect(validatePhoneNumber('987654321')).toBe(false);
      expect(validatePhoneNumber('98765432101')).toBe(false);
      expect(validatePhoneNumber('abcdefghij')).toBe(false);
    });
  });

  describe('createModalCloseHandler', () => {
    it('runs reset callbacks then closes', () => {
      const resetA = jest.fn();
      const resetB = jest.fn();
      const onClose = jest.fn();

      createModalCloseHandler([resetA, resetB], onClose)();

      expect(resetA).toHaveBeenCalledTimes(1);
      expect(resetB).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
