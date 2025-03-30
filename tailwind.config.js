/** @type {import('tailwindcss').Config} */
export const content = [
  './src/**/*.{js,jsx,ts,tsx}',
  './src/**/**/*.{js,jsx,ts,tsx}',
];
export const theme = {
  fontFamily: {
    retro: ['RetromaVibesRegular'],
    classy: ['GowunDodum-Regular']
  },

  extend: {
    colors: {
      edcPurple: {
        10: '#e9b8f5',
        20: '#d478f5',
        40: '#a947cc',
        60: '#7a047a',
        60: '#470247',
        80: '#2b022b'
      },
      edcBlue: {
        10: '#c1eaf7',
        20: '#96e2fa',
        40: '#7ad7f5',
        60: '#3eccfa',
        80: '#009ed1'
      },
      edcYellow: {
        20: '#ffd470',
        40: '#f7bb36',  
        60: '#ffb30f',
        80: '#fcad00'
      }

    },
  },
};
export const plugins = [];