import type {StateCreator} from 'zustand';
import type {User} from 'firebase/auth';
import type {AppState} from './appStore';

export type AdminSliceType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const createAdminSlice: StateCreator<
  AppState,
  [['zustand/immer', never]],
  [],
  AdminSliceType
> = set => ({
  user: null,
  setUser: (user: User | null) => {
    set(state => {
      state.user = user; // ✅ mutate directly — immer handles it
    });
  },
});
