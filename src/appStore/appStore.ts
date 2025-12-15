import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {createAdminSlice, type AdminSliceType} from './adminSlice';
import {createButtonSlice, type ButtonSliceType} from './buttonSlice';
import {createThemeSlice, type ThemeSliceType} from './themeSlice';
import {createClinicSlice, type ClinicSliceType} from './clinicSlice';

export type AppState = AdminSliceType &
  ButtonSliceType &
  ThemeSliceType &
  ClinicSliceType;

export const appStore = create<AppState>()(
  immer((...store) => ({
    ...createAdminSlice(...store),
    ...createButtonSlice(...store),
    ...createThemeSlice(...store),
    ...createClinicSlice(...store),
  })),
);
