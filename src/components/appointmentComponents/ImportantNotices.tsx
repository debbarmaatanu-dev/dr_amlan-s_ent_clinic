import React from 'react';
import {useTheme} from '@/hooks/useTheme';
import {appStore} from '@/appStore/appStore';
import {
  CLINIC_HOURS_EVENING,
  CLINIC_HOURS_SUNDAY,
} from '@/constants/clinicSchedule';

interface NoticeRowProps {
  icon: string;
  label: string;
  iconClassName?: string;
  rowClassName?: string;
  children: React.ReactNode;
}

const NoticeRow = ({
  icon,
  label,
  iconClassName = '',
  rowClassName = '',
  children,
}: NoticeRowProps) => (
  <div className={`flex items-start gap-2 ${rowClassName}`}>
    <dt className="sr-only">{label}</dt>
    <span
      className={`flex w-5 shrink-0 justify-center pt-0.5 ${iconClassName}`}
      aria-hidden="true">
      <i className={`fa-solid ${icon}`} />
    </span>
    <dd className="min-w-0 flex-1">{children}</dd>
  </div>
);

export const ImportantNotices = (): React.JSX.Element => {
  const {actualTheme} = useTheme();
  const clinicStatus = appStore(state => state.clinicStatus);
  // Clinic status is fetched by Navbar (always mounted)

  const bgBlue = actualTheme === 'light' ? 'bg-blue-50' : 'bg-blue-900';
  const textBlue = actualTheme === 'light' ? 'text-blue-900' : 'text-blue-100';
  const textBlueSecondary =
    actualTheme === 'light' ? 'text-blue-800' : 'text-blue-200';
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
                <a href="tel:+916033521499" className="underline">
                  +91 6033521499
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
            className={`mb-3 text-lg font-bold ${textBlue}`}>
            <i className="fa-solid fa-circle-info mr-2" aria-hidden="true"></i>
            Appointment Information
          </h3>
        </header>
        <dl className={`space-y-2 text-sm ${textBlueSecondary}`}>
          <NoticeRow icon="fa-clock" label="Evening clinic">
            <strong>Evening clinic:</strong> {CLINIC_HOURS_EVENING} (Mon, Tue,
            Thu, Fri &amp; Sat except 2nd &amp; 4th)
          </NoticeRow>
          <NoticeRow icon="fa-clock" label="Sunday">
            <strong>Sunday:</strong> {CLINIC_HOURS_SUNDAY}
          </NoticeRow>
          <NoticeRow
            icon="fa-calendar-xmark"
            label="Closed days"
            iconClassName="text-red-500"
            rowClassName="text-red-500">
            <strong>Closed:</strong> Every Wednesday; 2nd &amp; 4th Saturday of
            each month
          </NoticeRow>
          <NoticeRow icon="fa-indian-rupee-sign" label="Consultation fee">
            <strong>Consultation Fee:</strong> ₹400 (Fixed)
          </NoticeRow>
          <NoticeRow icon="fa-calendar-check" label="Online booking slots">
            <strong>Online Booking Slots per Day:</strong> 10
          </NoticeRow>
          <NoticeRow icon="fa-users" label="Offline booking slots">
            <strong>Offline Booking Slots (at clinic):</strong> 10 additional
            slots available
          </NoticeRow>
        </dl>
      </article>

      {/* Follow-up Appointments Box */}
      <article
        className={`rounded-lg ${bgAmber} p-4`}
        role="region"
        aria-labelledby="followup-heading">
        <header>
          <h3
            id="followup-heading"
            className={`mb-2 text-lg font-bold ${textAmber}`}>
            <i
              className="fa-solid fa-calendar-plus mr-2"
              aria-hidden="true"></i>
            Follow-up Appointments
          </h3>
        </header>
        <p className={`text-sm ${textAmberSecondary}`}>
          First (1st) Follow-up appointments within 2 weeks are free of charge.{' '}
          <span className={`${textAmber} font-semibold`}>
            Follow-ups must be booked offline by calling or visiting at the
            clinic location.
          </span>
        </p>
      </article>
    </section>
  );
};
