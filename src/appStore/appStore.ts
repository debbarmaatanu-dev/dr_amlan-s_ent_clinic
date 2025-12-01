import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {createAdminSlice, type AdminSliceType} from './adminSlice';

export type AppState = AdminSliceType;

export const appStore = create<AppState>()(
  immer((...store) => ({
    ...createAdminSlice(...store),
  })),
);
