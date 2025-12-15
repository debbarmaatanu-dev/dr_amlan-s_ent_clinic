import type {StateCreator} from 'zustand';
import type {AppState} from './appStore';

export interface ClinicStatus {
  isManuallyOverridden: boolean;
  closedFrom?: string;
  closedTill?: string;
  displayMessage?: string;
}

export type ClinicSliceType = {
  clinicStatus: ClinicStatus | null;
  clinicStatusLoaded: boolean;
  setClinicStatus: (status: ClinicStatus | null) => void;
  setClinicStatusLoaded: (loaded: boolean) => void;
  fetchClinicStatus: () => Promise<void>;
};

export const createClinicSlice: StateCreator<
  AppState,
  [['zustand/immer', never]],
  [],
  ClinicSliceType
> = (set, get) => ({
  clinicStatus: null,
  clinicStatusLoaded: false,

  setClinicStatus: (status: ClinicStatus | null) => {
    set(state => {
      state.clinicStatus = status;
    });
  },

  setClinicStatusLoaded: (loaded: boolean) => {
    set(state => {
      state.clinicStatusLoaded = loaded;
    });
  },

  fetchClinicStatus: async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/appointment/clinic-status`,
      );

      const data = await response.json();

      if (data.success) {
        const status = data.status;

        // Generate display message based on status
        let displayMessage = '';
        if (status.isManuallyOverridden) {
          if (status.closedTill) {
            displayMessage = `Clinic bookings are temporarily closed from ${new Date(
              status.closedFrom + 'T00:00:00',
            ).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })} to ${new Date(
              status.closedTill + 'T00:00:00',
            ).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}. Please contact us for urgent consultations.`;
          } else {
            displayMessage = `Clinic bookings are temporarily closed from ${new Date(
              status.closedFrom + 'T00:00:00',
            ).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })} until further notice. Please contact us for urgent consultations.`;
          }
        }

        get().setClinicStatus({
          ...status,
          displayMessage,
        });
      } else {
        get().setClinicStatus(null);
      }

      get().setClinicStatusLoaded(true);
    } catch (error) {
      console.error('Error fetching clinic status:', error);
      get().setClinicStatus(null);
      get().setClinicStatusLoaded(true);
    }
  },
});
