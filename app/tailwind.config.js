const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: [],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        overlay: 'rgba(51,51,51,.75)',
        'overlay-light': 'rgba(255,255,255,.3)',
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    borderWidth: ['responsive', 'hover'],
  },
  plugins: [],
};
