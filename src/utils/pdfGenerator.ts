// Dynamic imports for PDF generation libraries (only loaded when needed)
import type {PDFBookingData} from '../types/types';
import {logger} from './logger';

export const generateBookingReceiptPDF = async (
  bookingData: PDFBookingData,
): Promise<void> => {
  const receiptElement = document.getElementById('booking-receipt');

  if (!receiptElement) {
    alert('Could not find receipt content.');
    return;
  }

  try {
    // Dynamically import PDF libraries only when needed
    const [{toJpeg}, jsPDF] = await Promise.all([
      import('html-to-image'),
      import('jspdf').then(module => module.default),
    ]);
    // Store original styles
    const originalStyles = {
      width: receiptElement.style.width,
      maxWidth: receiptElement.style.maxWidth,
    };

    // Force consistent layout for capture
    receiptElement.style.width = '800px';
    receiptElement.style.maxWidth = '800px';

    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the content as JPEG
    const imgData = await toJpeg(receiptElement, {
      quality: 0.9,
      pixelRatio: 2,
      cacheBust: true,
      skipFonts: false,
    });

    // Restore original styles
    receiptElement.style.width = originalStyles.width;
    receiptElement.style.maxWidth = originalStyles.maxWidth;

    // Load the image
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = imgData;
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const margin = 10;

    // Calculate dimensions
    const imgWidth = img.width;
    const imgHeight = img.height;

    // Calculate width to fit on page with margins
    const availableWidth = pdfWidth - 2 * margin;
    const scaleFactor = availableWidth / imgWidth;
    const scaledHeight = imgHeight * scaleFactor;

    // Add image to PDF (single page for receipt)
    pdf.addImage(
      imgData,
      'JPEG',
      margin,
      margin,
      availableWidth,
      Math.min(scaledHeight, pdfHeight - 2 * margin),
    );

    // Save PDF
    const fileName = `Appointment_Receipt_${bookingData.name.replace(/\s+/g, '_')}_Slot${bookingData.slotNumber}_${bookingData.date}.pdf`;
    pdf.save(fileName);

    logger.log('Receipt PDF downloaded successfully!');
  } catch (error) {
    logger.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
