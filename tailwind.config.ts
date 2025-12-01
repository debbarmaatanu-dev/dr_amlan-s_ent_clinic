import type {Config} from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xl: {min: '1280px'},
      lg: {min: '1024px'},
      md: {min: '820px'},
      sm: {min: '766px'},
      xs: {min: '580px'},
      xxs: {min: '430px'},
      xxxs: {min: '410px'},
      xxxxs: {min: '380px'},
      xxxxxs: {min: '350px'},
    },
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': {opacity: '0', transform: 'scale(0.95)'},
          '100%': {opacity: '1', transform: 'scale(1)'},
        },
      },
    },
  },
  plugins: [],
};

export default config;
