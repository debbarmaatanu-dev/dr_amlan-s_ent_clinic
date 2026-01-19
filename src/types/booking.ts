/**
 * Unified booking table data interface
 * Used across admin and customer modals
 */
export interface BookingTableData {
  slotNumber: number;
  name: string;
  phone: string;
  date: string;
  gender: string;
  age: number;
  amount: number;
  paymentId: string;
  orderId: string;
  paymentMethod?: string;
  paymentStatus?: string;
  timestamp?: string;
  refundInfo?: {
    refundId?: string;
    status?: string;
    reason?: string;
  };
}
