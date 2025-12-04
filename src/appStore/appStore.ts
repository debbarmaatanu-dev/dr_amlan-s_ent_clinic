import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {createAdminSlice, type AdminSliceType} from './adminSlice';
import {createButtonSlice, type ButtonSliceType} from './buttonSlice';

export type AppState = AdminSliceType & ButtonSliceType;

export const appStore = create<AppState>()(
  immer((...store) => ({
    ...createAdminSlice(...store),
    ...createButtonSlice(...store),
  })),
);
