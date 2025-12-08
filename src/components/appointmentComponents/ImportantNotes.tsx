import React from 'react';

export const ImportantNotes: React.FC = () => {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="h-full w-full bg-linear-to-br from-yellow-50 via-orange-50 to-red-50 p-8 md:p-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          <i className="fa-solid fa-circle-info mr-2 text-blue-600"></i>
          Important Information
        </h2>

        <div className="space-y-4">
          {/* Clinic Hours */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-800">
              <i className="fa-solid fa-clock mr-2 text-green-600"></i>
              Clinic Hours
            </h3>
            <p className="text-gray-600">
              Monday to Saturday: 6:00 PM - 8:30 PM
            </p>
            <p className="text-sm text-red-600">Closed on Sundays</p>
          </div>

          {/* Booking Policy */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-800">
              <i className="fa-solid fa-calendar-check mr-2 text-blue-600"></i>
              Booking Policy
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              <li>Online bookings: 10 slots per day</li>
              <li>Offline booking (at Clinic): 10 slots per day</li>
              <li>Advance booking: Up to 10 days</li>
              <li>Booking closes at 7:00 PM for same day</li>
            </ul>
          </div>

          {/* Payment */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-800">
              <i className="fa-solid fa-indian-rupee-sign mr-2 text-green-600"></i>
              Consultation Fee
            </h3>
            <p className="text-gray-600">₹400 per consultation</p>
            <p className="text-sm text-gray-500">
              Payment via UPI, Card, NetBanking, or Wallet
            </p>
          </div>

          {/* What to Bring */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-800">
              <i className="fa-solid fa-file-medical mr-2 text-purple-600"></i>
              What to Bring
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
              <li>Previous medical records (if any)</li>
              <li>List of current medications</li>
              <li>Valid ID proof</li>
              <li>Booking confirmation receipt</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-800">
              <i className="fa-solid fa-phone mr-2 text-orange-600"></i>
              Need Help?
            </h3>
            <p className="text-sm text-gray-600">
              For queries, call:{' '}
              <a
                href="tel:+918414035530"
                className="font-semibold text-blue-600 hover:underline">
                +91 84140 35530
              </a>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
