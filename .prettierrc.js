'use strict';

module.exports = {
  printWidth: 100,
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      files: '*.{js,gjs,ts,gts,mjs,mts,cjs,cts}',
      options: {
        singleQuote: true,
        // TODO: Update this to `false` in another PR
        templateSingleQuote: true,
      },
    },
  ],
};
