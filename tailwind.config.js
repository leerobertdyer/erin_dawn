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
        20: '#d478f5',
        40: '#a947cc',
        60: '#7a047a',
        60: '#470247',
        80: '#2b022b'
      },
      edcBlue: {
        20: '#96e2fa',
        40: '#7ad7f5',
        60: '#3eccfa',
        80: '#009ed1'
      }

    },
  },
};
export const plugins = [];