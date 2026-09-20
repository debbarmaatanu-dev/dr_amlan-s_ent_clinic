import {useMemo} from 'react';
import {useAppStore} from '@/appStore/appStore';
import {isManuallyClosedOnDate} from '@/utils/clinicControlHelpers';

export const useClinicStatus = () => {
  const clinicStatus = useAppStore(state => state.clinicStatus);
  const clinicStatusLoaded = useAppStore(state => state.clinicStatusLoaded);

  const isClinicClosed = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return isManuallyClosedOnDate(clinicStatus, today);
  }, [clinicStatus]);

  return {
    clinicStatus,
    clinicStatusLoaded,
    isClinicClosed,
  };
};
