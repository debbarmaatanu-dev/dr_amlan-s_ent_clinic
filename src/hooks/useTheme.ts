import {appStore} from '@/appStore/appStore';
import type {ActualTheme} from '@/appStore/themeSlice';

/**
 * Custom hook for accessing theme state and methods
 *
 * @returns {Object} Theme state and methods
 * @property {ActualTheme} actualTheme - Current theme ('light' | 'dark')
 * @property {Function} setThemeMode - Function to change theme mode
 *
 * @example
 * const { actualTheme } = useTheme();
 *
 * <div className={actualTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
 *   Content
 * </div>
 */
export const useTheme = () => {
  const actualTheme: ActualTheme = appStore(state => state.actualTheme);
  const setThemeMode = appStore(state => state.setThemeMode);

  return {
    actualTheme,
    setThemeMode,
  };
};
