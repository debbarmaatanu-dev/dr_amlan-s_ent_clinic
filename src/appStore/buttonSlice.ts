import type {StateCreator} from 'zustand';
import type {AppState} from './appStore';

export type ButtonSliceType = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (truthy: boolean) => void;
};

export const createButtonSlice: StateCreator<
  AppState,
  [['zustand/immer', never]],
  [],
  ButtonSliceType
> = set => ({
  mobileNavOpen: false,
  setMobileNavOpen: (truthy: boolean) => {
    set(state => {
      state.mobileNavOpen = truthy; // ✅ mutate directly — immer handles it
    });
  },
});
