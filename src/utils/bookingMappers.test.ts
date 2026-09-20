import {describe, expect, it} from '@jest/globals';
import {toPaymentBookingData} from './bookingMappers';
import type {BookingTableData} from '../types/booking';

describe('toPaymentBookingData', () => {
  it('maps table rows into receipt booking data', () => {
    const row: BookingTableData = {
      slotNumber: 2,
      name: 'Pat',
      phone: '9876543210',
      date: '2026-09-03',
      gender: 'Female',
      age: 30,
      amount: 400,
      paymentId: 'pay_1',
      orderId: 'ord_1',
      paymentMethod: 'UPI',
      paymentStatus: 'successful',
      refundInfo: {refundId: 'rf_1', reason: 'n/a'},
    };

    expect(toPaymentBookingData(row)).toEqual({
      slotNumber: 2,
      date: '2026-09-03',
      name: 'Pat',
      gender: 'Female',
      age: 30,
      phone: '9876543210',
      amount: 400,
      paymentId: 'pay_1',
      orderId: 'ord_1',
      paymentMethod: 'UPI',
      paymentStatus: 'successful',
      refundInfo: {refundId: 'rf_1', reason: 'n/a'},
    });
  });
});
