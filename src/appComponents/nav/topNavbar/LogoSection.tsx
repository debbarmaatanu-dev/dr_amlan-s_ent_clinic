import type {ActualTheme} from '@/appStore/themeSlice';
import {IMAGES} from '@/constants/images';

type LogoSectionProps = {
  handleHomeClick: () => void;
  actualTheme: ActualTheme;
};

export const LogoSection = ({
  handleHomeClick,
  actualTheme,
}: LogoSectionProps) => {
  const getTextColor = () => {
    if (actualTheme === 'light') {
      return 'text-gray-600';
    } else {
      return 'text-gray-200';
    }
  };

  return (
    <button
      type="button"
      onClick={handleHomeClick}
      className="xxxs:space-x-3 flex cursor-pointer items-center space-x-2 rounded-md transition-all hover:opacity-80 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
      aria-label="Go to home">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full p-1 shadow-md ${actualTheme === 'light' ? 'bg-blue-200/80' : 'bg-white'}`}>
        <img
          src={IMAGES.LOGO_TOP}
          alt="Dr. (Major) Amlan's ENT & Allergy Clinic Logo"
          width="64"
          height="64"
          className="h-full w-full rounded-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="flex flex-col">
        <span className="xxxxxs:text-xs xxxxxs:font-semibold xxxxs:text-xs xxxxs:font-semibold xxxs:text-sm xxxs:font-bold xs:text-base xs:font-bold leading-tight text-blue-600 md:text-lg md:font-bold">
          <span className="xxxxxs:block xxxxs:block xxxs:inline">
            DR (MAJOR)
          </span>{' '}
          <span className="xxxxxs:block xxxxs:block xxxs:inline">AMLAN'S</span>
        </span>
        <span
          className={`xxxxxs:text-xs xxxxs:text-xs xxxs:text-sm xs:text-sm ${getTextColor()}`}>
          ENT &amp; Allergy Clinic
        </span>
      </div>
    </button>
  );
};
