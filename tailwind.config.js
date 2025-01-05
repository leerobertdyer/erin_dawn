  /** @type {import('tailwindcss').Config} */
  export const content = [
  './src/**/*.{js,jsx,ts,tsx}',
  './src/**/**/*.{js,jsx,ts,tsx}',
];
export const theme = {
  fontFamily: {
    retro: ['RetromaVibesRegular']
  },

  extend: {
    colors: {
      edcPurple: {
        LIGHTER: '#c5a3c5',
        LIGHT: '#7a047a',
        BASE: '#470247',
        DARK: '#2b022b'
      }
    },
  },
};
export const plugins = [];