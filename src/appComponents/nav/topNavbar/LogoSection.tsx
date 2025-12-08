import {LogoSVG} from '@/assets/Logo_SVG';

type LogoSectionProps = {
  handleHomeClick: () => void;
};

export const LogoSection = ({handleHomeClick}: LogoSectionProps) => {
  return (
    <button
      onClick={handleHomeClick}
      className="xxxs:space-x-3 flex cursor-pointer items-center space-x-2 transition-all hover:opacity-80 active:scale-95"
      aria-label="Go to home">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100/80 p-1 shadow-md">
        <LogoSVG />
      </div>
      <div className="flex flex-col">
        <span className="xxxxxs:text-xs xxxxxs:font-semibold xxxxs:text-xs xxxxs:font-semibold xxxs:text-sm xxxs:font-bold xs:text-base xs:font-bold leading-tight text-blue-600 md:text-lg md:font-bold">
          <span className="xxxxxs:block xxxxs:block xxxs:inline">
            DR (MAJOR)
          </span>{' '}
          <span className="xxxxxs:block xxxxs:block xxxs:inline">AMLAN'S</span>
        </span>
        <span className="xxxxxs:text-xs xxxxs:text-xs xxxs:text-sm xs:text-sm text-gray-600">
          ENT Clinic
        </span>
      </div>
    </button>
  );
};
