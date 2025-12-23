export default {
  printWidth: 100,
  plugins: ['prettier-plugin-ember-template-tag'],
  singleQuote: true,
  overrides: [
    {
      files: ['*.js', '*.ts', '*.cjs', '.mjs', '.cts', '.mts', '.cts'],
      options: {
        trailingComma: 'es5',
      },
    },
    {
      files: ['*.html'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.json'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.hbs'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.gjs', '*.gts'],
      options: {
        // TODO: Update this to `false` in another PR since this will generate
        // a large amount of file changes.
        templateSingleQuote: true,
        trailingComma: 'es5',
      },
    },
  ],
};
