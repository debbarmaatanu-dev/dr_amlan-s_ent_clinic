import type {StateCreator} from 'zustand';
import type {AppState} from './appStore';
import Cookies from 'js-cookie';

export type ThemeMode = 'light' | 'dark';
export type ActualTheme = 'light' | 'dark';

export type ThemeSliceType = {
  actualTheme: ActualTheme;
  setThemeMode: (mode: ThemeMode) => void;
  initializeTheme: () => void;
};

const THEME_COOKIE_NAME = 'theme-preference';
const COOKIE_EXPIRY_DAYS = 365;

// Helper to apply theme to document
const applyThemeToDocument = (theme: ActualTheme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const createThemeSlice: StateCreator<
  AppState,
  [['zustand/immer', never]],
  [],
  ThemeSliceType
> = set => {
  return {
    actualTheme: 'light',

    setThemeMode: (mode: ThemeMode) => {
      set(state => {
        state.actualTheme = mode;
        applyThemeToDocument(mode);

        // Save to cookie
        Cookies.set(THEME_COOKIE_NAME, mode, {
          expires: COOKIE_EXPIRY_DAYS,
          sameSite: 'Lax',
          secure: window.location.protocol === 'https:',
        });
      });
    },

    initializeTheme: () => {
      set(state => {
        // Try to get theme from cookie
        const savedTheme = Cookies.get(THEME_COOKIE_NAME) as
          | ThemeMode
          | undefined;

        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          state.actualTheme = savedTheme;
        } else {
          // Default to light if no cookie found
          state.actualTheme = 'light';
        }

        applyThemeToDocument(state.actualTheme);
      });
    },
  };
};
