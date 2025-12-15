import type {StateCreator} from 'zustand';
import type {User} from 'firebase/auth';
import type {AppState} from './appStore';

export type AdminSliceType = {
  user: User | null;
  authInitialized: boolean;
  setUser: (user: User | null) => void;
  setAuthInitialized: (initialized: boolean) => void;
};

export const createAdminSlice: StateCreator<
  AppState,
  [['zustand/immer', never]],
  [],
  AdminSliceType
> = set => ({
  user: null,
  authInitialized: false,
  setUser: (user: User | null) => {
    set(state => {
      state.user = user; // ✅ mutate directly — immer handles it
      state.authInitialized = true; // Mark auth as initialized when user state is set
    });
  },
  setAuthInitialized: (initialized: boolean) => {
    set(state => {
      state.authInitialized = initialized;
    });
  },
});
