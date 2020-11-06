'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { join } = require('path');
const isProduction = EmberApp.env() === 'production';

const purgeCSS = {
  module: require('@fullhuman/postcss-purgecss'),
  options: {
    content: [
      // Specify all paths in the application that include Tailwind classes.
      join(__dirname, 'app', 'index.html'),
      join(__dirname, 'app', 'styles', '**', '*.css'),
      join(__dirname, 'app', '**', '*.hbs'),
      join(__dirname, 'app', '**', '*.js'),
    ],

    // This is the function used to extract class names from your templates
    defaultExtractor: content => {
      // Capture as liberally as possible, including things like `h-(screen-1.5)`
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

      // Capture classes within other delimiters like .block(class="w-1/2") in Pug
      const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];

      return broadMatches.concat(innerMatches);
    },
  },
};

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['apple-touch-icon.png', 'images/*.*'],
    },

    'ember-composable-helpers': {
      only: ['sort-by'],
    },

    postcssOptions: {
      compile: {
        plugins: [
          {
            module: require('postcss-import'),
            options: {
              path: ['node_modules'],
            },
          },
          require('tailwindcss')('app/tailwind.config.js'),
          require('autoprefixer'),
          // Only apply the purge CSS plugin to the production builds.
          ...(isProduction ? [purgeCSS] : []),
        ],
      },
    },
  });

  return app.toTree();
};
