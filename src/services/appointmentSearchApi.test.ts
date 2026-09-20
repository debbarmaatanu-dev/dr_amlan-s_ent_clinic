import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import {searchAppointments} from './appointmentSearchApi';

describe('searchAppointments', () => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockReset();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a single booking', async () => {
    const booking = {
      slotNumber: 1,
      date: '2026-09-03',
      name: 'Pat',
      gender: 'Female',
      age: 28,
      phone: '9876543210',
      amount: 400,
      paymentId: 'pay_1',
      orderId: 'ord_1',
    };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({success: true, booking}),
    } as Response);

    await expect(
      searchAppointments('9876543210', '2026-09-03'),
    ).resolves.toEqual({
      ok: true,
      multiple: false,
      booking,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://backend.test/api/appointment/search',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({phone: '9876543210', date: '2026-09-03'}),
      },
    );
  });

  it('returns multiple bookings', async () => {
    const bookings = [
      {slotNumber: 1, name: 'A', phone: '9876543210'},
      {slotNumber: 2, name: 'B', phone: '9876543210'},
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({success: true, multiple: true, bookings}),
    } as Response);

    await expect(
      searchAppointments('9876543210', '2026-09-03'),
    ).resolves.toEqual({
      ok: true,
      multiple: true,
      bookings,
    });
  });

  it('maps GEO_RESTRICTED and network failures', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({success: false, code: 'GEO_RESTRICTED'}),
    } as Response);

    await expect(
      searchAppointments('9876543210', '2026-09-03'),
    ).resolves.toEqual({
      ok: false,
      error: expect.stringMatching(/only available in India/i),
    });

    fetchMock.mockRejectedValueOnce(new Error('offline'));

    await expect(
      searchAppointments('9876543210', '2026-09-03'),
    ).resolves.toEqual({
      ok: false,
      error: 'Failed to search appointment. Please try again.',
    });
  });
});
