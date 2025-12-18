import React from 'react';
import {useTheme} from '@/hooks/useTheme';
import {appStore} from '@/appStore/appStore';

export const ImportantNotices = (): React.JSX.Element => {
  const {actualTheme} = useTheme();
  const clinicStatus = appStore(state => state.clinicStatus);
  // Clinic status is fetched by Navbar (always mounted)

  const bgBlue = actualTheme === 'light' ? 'bg-blue-50' : 'bg-blue-900';
  const textBlue = actualTheme === 'light' ? 'text-blue-900' : 'text-blue-100';
  const textBlueSecondary =
    actualTheme === 'light' ? 'text-blue-800' : 'text-blue-200';
  const bgGreen = actualTheme === 'light' ? 'bg-green-50' : 'bg-green-900';
  const textGreen =
    actualTheme === 'light' ? 'text-green-900' : 'text-green-100';
  const textGreenSecondary =
    actualTheme === 'light' ? 'text-green-800' : 'text-green-200';
  const bgAmber = actualTheme === 'light' ? 'bg-amber-50' : 'bg-amber-900';
  const textAmber =
    actualTheme === 'light' ? 'text-amber-900' : 'text-amber-100';
  const textAmberSecondary =
    actualTheme === 'light' ? 'text-amber-800' : 'text-amber-200';
  const bgRed = actualTheme === 'light' ? 'bg-red-50' : 'bg-red-900';
  const textRed = actualTheme === 'light' ? 'text-red-900' : 'text-red-100';
  const textRedSecondary =
    actualTheme === 'light' ? 'text-red-800' : 'text-red-200';

  return (
    <section
      className="mb-6 space-y-4"
      aria-labelledby="important-notices-heading">
      <h2 id="important-notices-heading" className="sr-only">
        Important Appointment Information
      </h2>

      {/* Clinic Closure Notice - Show if manually closed */}
      {clinicStatus?.isManuallyOverridden && clinicStatus.displayMessage && (
        <article
          className={`rounded-lg ${bgRed} border-2 border-red-200 p-4`}
          role="alert"
          aria-labelledby="clinic-closure-heading">
          <header>
            <h3
              id="clinic-closure-heading"
              className={`mb-3 font-bold ${textRed} text-lg`}>
              <i
                className="fa-solid fa-exclamation-triangle mr-2"
                aria-hidden="true"></i>
              CLINIC TEMPORARILY CLOSED
            </h3>
          </header>
          <p className={`text-sm ${textRedSecondary} font-medium`}>
            {clinicStatus.displayMessage}
          </p>
          <div className={`mt-3 text-sm ${textRedSecondary}`}>
            <p>
              <strong>For urgent consultations:</strong>
            </p>
            <ul className="mt-1 ml-4 list-disc">
              <li>
                Call:{' '}
                <a href="tel:+918258839231" className="underline">
                  +91 8258839231
                </a>
              </li>
              <li>
                WhatsApp:{' '}
                <a
                  href="https://wa.me/916033521499"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer">
                  +91 6033521499
                </a>
              </li>
            </ul>
          </div>
        </article>
      )}

      {/* Appointment Information Box */}
      <article
        className={`rounded-lg ${bgBlue} p-4`}
        role="region"
        aria-labelledby="appointment-info-heading">
        <header>
          <h3
            id="appointment-info-heading"
            className={`mb-3 font-semibold ${textBlue}`}>
            <i className="fa-solid fa-circle-info mr-2" aria-hidden="true"></i>
            Appointment Information
          </h3>
        </header>
        <dl className={`space-y-2 text-sm ${textBlueSecondary}`}>
          <div>
            <dt className="inline">
              <i className="fa-solid fa-clock mr-2" aria-hidden="true"></i>
              <strong>Clinic Hours:</strong>
            </dt>
            <dd className="ml-1 inline">
              6:00 PM - 8:30 PM (Closed on Sundays)
            </dd>
          </div>
          <div>
            <dt className="inline">
              <i
                className="fa-solid fa-indian-rupee-sign mr-2"
                aria-hidden="true"></i>
              <strong>Consultation Fee:</strong>
            </dt>
            <dd className="ml-1 inline">₹400 (Fixed)</dd>
          </div>
          <div>
            <dt className="inline">
              <i
                className="fa-solid fa-calendar-check mr-2"
                aria-hidden="true"></i>
              <strong>Online Booking Slots per Day:</strong>
            </dt>
            <dd className="ml-1 inline">10</dd>
          </div>
          <div>
            <dt className="inline">
              <i className="fa-solid fa-users mr-2" aria-hidden="true"></i>
              <strong>Offline Booking Slots (at clinic):</strong>
            </dt>
            <dd className="ml-1 inline">10 additional slots available</dd>
          </div>
        </dl>
      </article>

      {/* Armed Forces Personnel Box */}
      <article
        className={`rounded-lg ${bgGreen} p-4`}
        role="region"
        aria-labelledby="armed-forces-heading">
        <header>
          <h3
            id="armed-forces-heading"
            className={`mb-2 font-semibold ${textGreen}`}>
            <i
              className="fa-solid fa-shield-halved mr-2"
              aria-hidden="true"></i>
            For Armed Forces Personnel
          </h3>
        </header>
        <p className={`text-sm ${textGreenSecondary}`}>
          Armed Forces personnel (Army, Navy, Air Force) and their dependents
          are exepmted from appointment fees. A valid Service/ESM/Dependent ID
          must be presented.{' '}
          <strong>Available only offline at clinic location.</strong>
        </p>
      </article>

      {/* Follow-up Appointments Box */}
      <article
        className={`rounded-lg ${bgAmber} p-4`}
        role="region"
        aria-labelledby="followup-heading">
        <header>
          <h3
            id="followup-heading"
            className={`mb-2 font-semibold ${textAmber}`}>
            <i
              className="fa-solid fa-calendar-plus mr-2"
              aria-hidden="true"></i>
            Follow-up Appointments
          </h3>
        </header>
        <p className={`text-sm ${textAmberSecondary}`}>
          First (1st) Follow-up appointments within 2 weeks are free of charge.{' '}
          <strong className={textAmber}>
            Follow-ups must be booked offline by calling or visiting at the
            clinic location.
          </strong>
        </p>
      </article>
    </section>
  );
};
