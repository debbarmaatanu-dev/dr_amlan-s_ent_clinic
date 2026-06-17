import {
  CLINIC_HOURS_EVENING,
  CLINIC_HOURS_SUNDAY,
  CLINIC_SCHEDULE_CLOSURE_SUMMARY,
  CLINIC_SCHEDULE_EXCEPT_SATURDAYS,
} from '@/constants/clinicSchedule';

export const ClinicScheduleSummaryText = () => (
  <>
    Mon, Tue, Thu, Fri & Sat{' '}
    <span className="font-bold">{CLINIC_SCHEDULE_EXCEPT_SATURDAYS}</span>:{' '}
    {CLINIC_HOURS_EVENING}. Sunday: {CLINIC_HOURS_SUNDAY}.{' '}
    <span className="font-bold">{CLINIC_SCHEDULE_CLOSURE_SUMMARY}</span>
  </>
);
