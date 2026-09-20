import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {redirectTo} from '../utils/redirect';
import {
  checkAvailableSlots,
  clearAllSlotCache,
  clearSlotCache,
  formatDateToDocId,
  initiatePayment,
  validateBookingAvailability,
  validateDateConstraints,
} from './appointmentService';

jest.mock('../utils/redirect', () => ({
  redirectTo: jest.fn(),
}));

describe('appointmentService', () => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
  const redirectMock = jest.mocked(redirectTo);

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockReset();
    redirectMock.mockReset();
    global.fetch = fetchMock;
    clearAllSlotCache();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 1, 10, 0, 0));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('formatDateToDocId', () => {
    it('converts YYYY-MM-DD to DD-MM-YYYY', () => {
      expect(formatDateToDocId('2026-09-03')).toBe('03-09-2026');
    });
  });

  describe('validateDateConstraints', () => {
    it('delegates to clinic schedule validation', () => {
      expect(validateDateConstraints('2026-09-02').isValid).toBe(false);
      expect(validateDateConstraints('2026-09-03').isValid).toBe(true);
    });
  });

  describe('checkAvailableSlots', () => {
    it('fetches available slots from the backend and caches the result', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({success: true, availableSlots: 7}),
      } as Response);

      const first = await checkAvailableSlots('2026-09-03');
      const second = await checkAvailableSlots('2026-09-03');

      expect(first).toBe(7);
      expect(second).toBe(7);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        'http://backend.test/api/appointment/available-slots?date=2026-09-03',
        {method: 'GET', headers: {'Content-Type': 'application/json'}},
      );
    });

    it('bypasses cache when forceRefresh is true', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({success: true, availableSlots: 5}),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({success: true, availableSlots: 4}),
        } as Response);

      await checkAvailableSlots('2026-09-03');
      const refreshed = await checkAvailableSlots('2026-09-03', true);

      expect(refreshed).toBe(4);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('clears a single date from the cache', async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({success: true, availableSlots: 3}),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({success: true, availableSlots: 2}),
        } as Response);

      await checkAvailableSlots('2026-09-03');
      clearSlotCache('2026-09-03');
      const again = await checkAvailableSlots('2026-09-03');

      expect(again).toBe(2);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('throws when the backend reports failure', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({success: false, error: 'upstream down'}),
      } as Response);

      await expect(checkAvailableSlots('2026-09-03')).rejects.toThrow(
        'upstream down',
      );
    });
  });

  describe('validateBookingAvailability', () => {
    it('returns early when the date is not bookable', async () => {
      const result = await validateBookingAvailability('2026-09-02');
      expect(result).toEqual({
        isAvailable: false,
        availableSlots: 0,
        error: expect.stringMatching(/Wednesday/i),
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns unavailable when no slots remain', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({success: true, availableSlots: 0}),
      } as Response);

      const result = await validateBookingAvailability('2026-09-03');
      expect(result).toEqual({
        isAvailable: false,
        availableSlots: 0,
        error: 'No slots available for this date.',
      });
    });

    it('returns available when slots remain', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({success: true, availableSlots: 6}),
      } as Response);

      await expect(validateBookingAvailability('2026-09-03')).resolves.toEqual({
        isAvailable: true,
        availableSlots: 6,
      });
    });

    it('surfaces a safe error when the slots API fails', async () => {
      fetchMock.mockRejectedValue(new Error('network'));

      await expect(validateBookingAvailability('2026-09-03')).resolves.toEqual({
        isAvailable: false,
        availableSlots: 0,
        error: 'Unable to validate availability. Please try again.',
      });
    });
  });

  describe('initiatePayment', () => {
    it('creates a payment order and redirects to PhonePe', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          redirectUrl: 'https://phonepe.test/pay',
        }),
      } as Response);

      const result = await initiatePayment(
        '2026-09-03',
        'Test Patient',
        'Male',
        30,
        '9876543210',
      );

      expect(fetchMock).toHaveBeenCalledWith(
        'http://backend.test/api/payment/create-order',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            date: '2026-09-03',
            name: 'Test Patient',
            gender: 'Male',
            age: 30,
            phone: '9876543210',
            amount: 400,
          }),
        },
      );
      expect(redirectMock).toHaveBeenCalledWith('https://phonepe.test/pay');
      expect(result).toEqual({success: true});
    });

    it('maps GEO_RESTRICTED and CLINIC_CLOSED backend codes', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({success: false, code: 'GEO_RESTRICTED'}),
      } as Response);

      await expect(
        initiatePayment('2026-09-03', 'A', 'Female', 25, '9876543210'),
      ).resolves.toEqual({
        success: false,
        error: expect.stringMatching(/only available in India/i),
      });

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          code: 'CLINIC_CLOSED',
          error: 'Closed by admin',
        }),
      } as Response);

      await expect(
        initiatePayment('2026-09-03', 'A', 'Female', 25, '9876543210'),
      ).resolves.toEqual({
        success: false,
        error: 'Closed by admin',
      });
    });

    it('returns a failure message when create-order throws', async () => {
      fetchMock.mockRejectedValue(new Error('offline'));

      await expect(
        initiatePayment('2026-09-03', 'A', 'Male', 40, '9876543210'),
      ).resolves.toEqual({
        success: false,
        error: 'Failed to initiate payment',
      });
    });
  });
});
