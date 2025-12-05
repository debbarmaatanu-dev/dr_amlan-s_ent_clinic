import React from 'react';

interface BookingReceiptProps {
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

export const BookingReceipt: React.FC<BookingReceiptProps> = ({
  bookingData,
}) => {
  const formattedDate = new Date(
    bookingData.date + 'T00:00:00',
  ).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const bookingTime = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      id="booking-receipt"
      className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="mb-6 border-b-2 border-blue-600 pb-4 text-center">
        <h1 className="text-2xl font-bold text-blue-600">
          Dr. (Major) Amlan's ENT Clinic
        </h1>
        <p className="text-sm text-gray-600">MBBS, MS ENT</p>
        <p className="text-sm text-gray-600">Ex-Army Medical Corps</p>
        <p className="mt-2 text-xs text-gray-500">
          1st floor, Capital pathlab, Bijoykumar Chowmuhani
        </p>
        <p className="text-xs text-gray-500">Agartala, West Tripura - 799001</p>
        <p className="text-xs text-gray-500">Ph: +91 8258839231</p>
      </div>

      {/* Receipt Title */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">
          Appointment Booking Receipt
        </h2>
        <p className="text-sm text-gray-500">Booked on: {bookingTime}</p>
      </div>

      {/* Success Icon */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <i className="fa-solid fa-check text-3xl text-green-600"></i>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="mb-6 rounded-lg bg-blue-50 p-4">
        <h3 className="mb-3 font-semibold text-gray-800">
          Appointment Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Slot Number:</span>
            <span className="font-semibold text-blue-600">
              #{bookingData.slotNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-semibold text-gray-800">{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold text-gray-800">
              6:00 PM - 8:30 PM
            </span>
          </div>
        </div>
      </div>

      {/* Patient Details */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <h3 className="mb-3 font-semibold text-gray-800">Patient Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-semibold text-gray-800">
              {bookingData.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gender:</span>
            <span className="text-gray-800 capitalize">
              {bookingData.gender}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Age:</span>
            <span className="text-gray-800">{bookingData.age} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="text-gray-800">+91 {bookingData.phone}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="mb-6 rounded-lg bg-green-50 p-4">
        <h3 className="mb-3 font-semibold text-gray-800">Payment Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid:</span>
            <span className="font-bold text-green-600">
              ₹{bookingData.amount}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Status:</span>
            <span className="font-semibold text-green-600">Paid</span>
          </div>
          {bookingData.paymentMethod && (
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="text-gray-800 uppercase">
                {bookingData.paymentMethod}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Payment ID:</span>
            <span className="font-mono text-xs text-gray-800">
              {bookingData.paymentId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-mono text-xs text-gray-800">
              {bookingData.orderId}
            </span>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mb-6 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
        <h3 className="mb-2 font-semibold text-yellow-800">
          Important Instructions
        </h3>
        <ul className="space-y-1 text-sm text-yellow-700">
          <li>• Please arrive 10 minutes before your scheduled time</li>
          <li>• Bring this receipt for verification</li>
          <li>• Clinic hours: 6:00 PM - 8:30 PM (Closed on Sundays)</li>
          <li>• For any queries, call: +91 8258839231</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
        <p>
          This is a computer-generated receipt and does not require signature
        </p>
        <p className="mt-1">Thank you for choosing Dr. Amlan's ENT Clinic</p>
      </div>
    </div>
  );
};
