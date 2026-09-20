import type {BookingTableData} from '../types/booking';
import type {PaymentBookingData} from '../types/types';

/** Map table-row booking data into receipt / PaymentBookingData shape. */
export function toPaymentBookingData(
  booking: BookingTableData,
): PaymentBookingData {
  return {
    slotNumber: booking.slotNumber,
    date: booking.date,
    name: booking.name,
    gender: booking.gender,
    age: booking.age,
    phone: booking.phone,
    amount: booking.amount,
    paymentId: booking.paymentId,
    orderId: booking.orderId,
    paymentMethod: booking.paymentMethod,
    paymentStatus: booking.paymentStatus,
    refundInfo: booking.refundInfo,
  };
}
