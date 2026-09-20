import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {auth} from './firebase';
import {
  controlClinicClosure,
  fetchProtectedClinicStatus,
  turnOnClinicBookings,
} from './adminClinicApi';

jest.mock('./firebase', () => ({
  auth: {
    currentUser: null as null | {getIdToken: () => Promise<string>},
  },
}));

describe('adminClinicApi', () => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
  const getIdToken = jest.fn(async () => 'token-abc');

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockReset();
    global.fetch = fetchMock;
    (auth as {currentUser: {getIdToken: typeof getIdToken}}).currentUser = {
      getIdToken,
    };
    getIdToken.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchProtectedClinicStatus', () => {
    it('requires auth', async () => {
      (auth as {currentUser: null}).currentUser = null;
      await expect(fetchProtectedClinicStatus()).resolves.toEqual({
        ok: false,
        authRequired: true,
        error: 'Authentication required',
      });
    });

    it('returns status on success', async () => {
      const status = {
        isManuallyOverridden: true,
        closedFrom: '2026-09-01',
        closedTill: '2026-09-05',
      };

      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({success: true, status}),
      } as Response);

      await expect(fetchProtectedClinicStatus()).resolves.toEqual({
        ok: true,
        status,
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'http://backend.test/api/protected/clinic-status',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token-abc',
          },
        },
      );
    });
  });

  describe('controlClinicClosure', () => {
    it('posts closure dates and builds success message', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({success: true}),
      } as Response);

      await expect(
        controlClinicClosure('2026-09-03', '2026-09-05'),
      ).resolves.toEqual({
        ok: true,
        message: 'Clinic bookings closed from 2026-09-03 to 2026-09-05',
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'http://backend.test/api/protected/control-clinic',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token-abc',
          },
          body: JSON.stringify({
            closedFrom: '2026-09-03',
            closedTill: '2026-09-05',
          }),
        },
      );

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({success: true}),
      } as Response);

      await expect(controlClinicClosure('2026-09-03', null)).resolves.toEqual({
        ok: true,
        message:
          'Clinic bookings closed from 2026-09-03 until manually reopened',
      });
    });

    it('returns backend and network errors', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({success: false, error: 'Denied'}),
      } as Response);

      await expect(controlClinicClosure('2026-09-03', null)).resolves.toEqual({
        ok: false,
        error: 'Denied',
      });

      fetchMock.mockRejectedValueOnce(new Error('offline'));

      await expect(controlClinicClosure('2026-09-03', null)).resolves.toEqual({
        ok: false,
        error: 'Failed to update clinic status. Please try again.',
      });
    });
  });

  describe('turnOnClinicBookings', () => {
    it('posts turn-on and returns success', async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({success: true}),
      } as Response);

      await expect(turnOnClinicBookings()).resolves.toEqual({
        ok: true,
        message: 'Clinic bookings turned on for today',
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'http://backend.test/api/protected/turn-on-clinic',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer token-abc',
          },
        },
      );
    });
  });
});
