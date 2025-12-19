const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./app/**/*.{css,gjs,gts,hbs,html,js}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      animation: {
        'modal-dialog-show': 'fade-in 200ms ease-out, grow-in 200ms ease-out',
        'modal-overlay-show': 'fade-in 100ms ease-out',
      },
      colors: {
        overlay: 'rgba(51,51,51,.75)',
        'overlay-light': 'rgba(255,255,255,.3)',
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        'grow-in': {
          '0%': {
            transform: 'scale(.95)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};
