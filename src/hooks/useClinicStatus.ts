import {useMemo} from 'react';
import {appStore} from '@/appStore/appStore';

export const useClinicStatus = () => {
  const clinicStatus = appStore(state => state.clinicStatus);
  const clinicStatusLoaded = appStore(state => state.clinicStatusLoaded);

  const isClinicClosed = useMemo(() => {
    if (!clinicStatus || !clinicStatus.isManuallyOverridden) {
      return false;
    }

    const today = new Date().toISOString().split('T')[0];
    const closedFrom = clinicStatus.closedFrom;
    const closedTill = clinicStatus.closedTill;

    if (!closedFrom) return false;

    // Check if today is within the closed period
    if (closedFrom <= today) {
      if (!closedTill || closedTill >= today) {
        return true; // Clinic is closed today
      }
    }

    return false;
  }, [clinicStatus]);

  return {
    clinicStatus,
    clinicStatusLoaded,
    isClinicClosed,
  };
};
