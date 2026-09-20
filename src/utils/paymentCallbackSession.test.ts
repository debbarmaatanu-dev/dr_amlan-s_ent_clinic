import {afterEach, beforeEach, describe, expect, it, jest} from '@jest/globals';
import type {PaymentCallbackResult} from '@/services/appointmentService';
import {
  clearPaymentCallbackSearchParams,
  readPaymentCallbackIdFromUrl,
  resetPaymentCallbackSessionForTests,
  resolvePaymentCallbackOnce,
} from './paymentCallbackSession';

describe('paymentCallbackSession', () => {
  beforeEach(() => {
    resetPaymentCallbackSessionForTests();
    window.history.replaceState(
      {},
      '',
      '/appointment?payment=callback&transaction_id=tx-strict-1',
    );
  });

  afterEach(() => {
    resetPaymentCallbackSessionForTests();
    window.history.replaceState({}, '', '/');
  });

  it('reads callback id from the URL without mutating history', () => {
    expect(readPaymentCallbackIdFromUrl()).toBe('tx-strict-1');
    expect(window.location.search).toContain('transaction_id=tx-strict-1');
  });

  it('clears callback query params from the URL', () => {
    clearPaymentCallbackSearchParams();
    expect(window.location.pathname).toBe('/appointment');
    expect(window.location.search).toBe('');
  });

  it('Strict Mode remount: one backend resolve, surviving subscriber applies result', async () => {
    const booking = {
      slotNumber: 1,
      date: '2026-09-03',
      name: 'Pat',
      gender: 'Female',
      age: 30,
      phone: '9876543210',
      amount: 400,
      paymentId: 'tx-strict-1',
      orderId: 'tx-strict-1',
    };
    const result: PaymentCallbackResult = {ok: true, booking};
    const resolve = jest.fn(
      () =>
        new Promise<PaymentCallbackResult>(resolvePromise => {
          setTimeout(() => resolvePromise(result), 20);
        }),
    );

    const paymentCallbackId = readPaymentCallbackIdFromUrl();
    expect(paymentCallbackId).toBe('tx-strict-1');

    // Effect setup #1 (Strict Mode)
    clearPaymentCallbackSearchParams();
    let active1 = true;
    const applied: PaymentCallbackResult[] = [];
    void resolvePaymentCallbackOnce(paymentCallbackId!, resolve).then(r => {
      if (!active1) return;
      applied.push(r);
    });

    // Effect cleanup #1 — would discard in-flight work if it owned the only call
    active1 = false;

    // URL is already clean; id must come from the earlier capture (component state)
    expect(window.location.search).toBe('');
    expect(readPaymentCallbackIdFromUrl()).toBe(null);

    // Effect setup #2 (Strict Mode remount) — must reuse the same in-flight promise
    const active2 = {current: true};
    void resolvePaymentCallbackOnce(paymentCallbackId!, resolve).then(r => {
      if (!active2.current) return;
      applied.push(r);
    });

    await new Promise(r => setTimeout(r, 40));

    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve).toHaveBeenCalledWith('tx-strict-1');
    expect(applied).toEqual([result]);
  });
});
