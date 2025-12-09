import {useTheme} from '@/hooks/useTheme';
import type {ThemeMode} from '@/appStore/themeSlice';

export const ThemeToggler = () => {
  const {actualTheme, setThemeMode} = useTheme();

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const getBGColor = () => {
    if (actualTheme === 'light') {
      return 'bg-gray-300';
    } else {
      return 'bg-gray-900';
    }
  };

  const getButtonClass = (mode: ThemeMode) => {
    const isActive = actualTheme === mode;

    if (isActive) {
      // Active button styles
      if (actualTheme === 'light') {
        return 'bg-gray-600/80 text-white shadow-md';
      } else {
        return 'bg-gray-500 text-white shadow-md';
      }
    } else {
      // Inactive button styles
      if (actualTheme === 'light') {
        return 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm';
      } else {
        return 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-gray-200';
      }
    }
  };

  return (
    <div className={`flex items-center gap-1 rounded-lg p-1 ${getBGColor()}`}>
      {/* Light Mode Button */}
      <button
        onClick={() => handleThemeChange('light')}
        className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-all ${getButtonClass('light')}`}
        aria-label="Light mode"
        title="Light mode">
        <i className="fa-solid fa-sun" aria-hidden="true"></i>
      </button>

      {/* Dark Mode Button */}
      <button
        onClick={() => handleThemeChange('dark')}
        className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-all ${getButtonClass('dark')}`}
        aria-label="Dark mode"
        title="Dark mode">
        <i className="fa-solid fa-moon" aria-hidden="true"></i>
      </button>
    </div>
  );
};
