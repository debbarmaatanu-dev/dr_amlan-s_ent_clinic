import {useTheme} from '@/hooks/useTheme';

/**
 * Custom hook for modal theme styling
 * Provides consistent theme classes across all modals
 */
export const useModalTheme = () => {
  const {actualTheme} = useTheme();

  return {
    actualTheme,
    bgColor: actualTheme === 'light' ? 'bg-white' : 'bg-gray-800',
    textColor: actualTheme === 'light' ? 'text-gray-800' : 'text-white',
    textSecondary: actualTheme === 'light' ? 'text-gray-600' : 'text-gray-300',
    inputBg: actualTheme === 'light' ? 'bg-white' : 'bg-gray-700',
    inputBorder:
      actualTheme === 'light' ? 'border-gray-300' : 'border-gray-600',
    inputText: actualTheme === 'light' ? 'text-gray-900' : 'text-white',
    tableBg: actualTheme === 'light' ? 'bg-gray-50' : 'bg-gray-700',
    borderColor:
      actualTheme === 'light' ? 'border-gray-200' : 'border-gray-600',
  };
};
