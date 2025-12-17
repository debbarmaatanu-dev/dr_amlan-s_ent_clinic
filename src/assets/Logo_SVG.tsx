import {IMAGES} from '@/constants/images';

export const LogoSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100%"
      height="100%"
      viewBox="0 0 512 512"
      className="h-full w-full rounded-full">
      <image xlinkHref={IMAGES.LOGO_TOP} x="0" y="0" width="512" height="512" />
    </svg>
  );
};
