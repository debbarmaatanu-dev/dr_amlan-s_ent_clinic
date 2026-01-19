import React, {useState} from 'react';
import {BookingReceipt} from '../BookingReceipt';
import {generateModalReceiptPDF} from '@/utils/pdfGenerator';
import {useModalTheme} from '@/hooks/useModalTheme';
import type {PaymentBookingData} from '../../types/types';
import {logger} from '@/utils/logger';

interface ReceiptViewProps {
  bookingData: PaymentBookingData;
  onBack: () => void;
  filePrefix: string;
  title?: string;
}

/**
 * Unified receipt view component with download functionality
 * Used in both admin and customer modals
 */
export const ReceiptView: React.FC<ReceiptViewProps> = ({
  bookingData,
  onBack,
  filePrefix,
  title = 'Booking Receipt',
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const {textColor} = useModalTheme();

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    try {
      await generateModalReceiptPDF(
        {
          slotNumber: bookingData.slotNumber,
          date: bookingData.date,
          name: bookingData.name,
          phone: bookingData.phone,
        },
        filePrefix,
      );
    } catch (error) {
      logger.error(`${filePrefix} download failed:`, error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="space-y-4" aria-labelledby="receipt-view-heading">
      <header className="flex items-center justify-between">
        <h2
          id="receipt-view-heading"
          className={`text-lg font-semibold ${textColor}`}>
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-all hover:bg-green-700 focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Download receipt for ${bookingData.name}`}>
            {isDownloading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-download"></i>
                <span>Download PDF</span>
              </>
            )}
          </button>
          <button
            onClick={onBack}
            className="cursor-pointer font-medium text-blue-600 hover:text-blue-800 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none"
            aria-label="Go back">
            <i className="fa-solid fa-arrow-left mr-2" aria-hidden="true"></i>
            Back
          </button>
        </div>
      </header>

      <BookingReceipt bookingData={bookingData} />
    </section>
  );
};
