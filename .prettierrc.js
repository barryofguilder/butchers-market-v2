'use strict';

module.exports = {
  singleQuote: true,
  printWidth: 100,
  overrides: [
    {
      files: 'app/**/*.hbs',
      options: {
        singleQuote: false,
      },
    },
  ],
};
