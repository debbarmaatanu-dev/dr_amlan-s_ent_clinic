import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {auth} from './firebase';
import {fetchAdminBookings} from './adminBookingsApi';

jest.mock('./firebase', () => ({
  auth: {
    currentUser: null as null | {getIdToken: () => Promise<string>},
  },
}));

describe('fetchAdminBookings', () => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
  const getIdToken = jest.fn(async () => 'token-abc');

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockReset();
    global.fetch = fetchMock;
    (
      auth as {currentUser: null | {getIdToken: typeof getIdToken}}
    ).currentUser = null;
    getIdToken.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requires authentication', async () => {
    await expect(fetchAdminBookings('2026-09-03')).resolves.toEqual({
      ok: false,
      error: 'Authentication required. Please log in again.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetches bookings with a bearer token', async () => {
    (auth as {currentUser: {getIdToken: typeof getIdToken}}).currentUser = {
      getIdToken,
    };
    const bookings = [{slotNumber: 1, name: 'Pat', phone: '9876543210'}];

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({success: true, bookings}),
    } as Response);

    await expect(fetchAdminBookings('2026-09-03')).resolves.toEqual({
      ok: true,
      bookings,
    });

    expect(getIdToken).toHaveBeenCalledWith(true);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://backend.test/api/protected/bookings/2026-09-03',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token-abc',
        },
      },
    );
  });

  it('maps backend and network failures', async () => {
    (auth as {currentUser: {getIdToken: typeof getIdToken}}).currentUser = {
      getIdToken,
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({success: false, error: 'No bookings'}),
    } as Response);

    await expect(fetchAdminBookings('2026-09-03')).resolves.toEqual({
      ok: false,
      error: 'No bookings',
    });

    fetchMock.mockRejectedValueOnce(new Error('offline'));

    await expect(fetchAdminBookings('2026-09-03')).resolves.toEqual({
      ok: false,
      error: 'Failed to fetch bookings. Please try again.',
    });
  });
});
