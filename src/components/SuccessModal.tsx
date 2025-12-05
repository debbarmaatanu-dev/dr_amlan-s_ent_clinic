import React from 'react';
import {BookingReceipt} from './BookingReceipt';
import {generateBookingReceiptPDF} from '@/utils/pdfGenerator';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    slotNumber: number;
    date: string;
    name: string;
    gender: string;
    age: number;
    phone: string;
    amount: number;
    paymentId: string;
    orderId: string;
    paymentMethod?: string;
  };
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  bookingData,
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateBookingReceiptPDF({
        slotNumber: bookingData.slotNumber,
        date: bookingData.date,
        name: bookingData.name,
        phone: bookingData.phone,
      });
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title">
      <div
        className="animate-fadeIn relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-gray-50 shadow-2xl"
        onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 z-10 float-right text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Close modal">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <i className="fa-solid fa-check text-4xl text-green-600"></i>
            </div>
            <h2
              id="success-modal-title"
              className="mb-2 text-2xl font-bold text-green-600">
              Booking Successful!
            </h2>
            <p className="text-gray-600">Your appointment has been confirmed</p>
          </div>

          {/* Receipt */}
          <BookingReceipt bookingData={bookingData} />

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
              {isDownloading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-download"></i>
                  <span>Download Receipt</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-95">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
