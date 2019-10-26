'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['apple-touch-icon.png', 'images/*.*'],
    },

    babel: {
      plugins: ['transform-object-rest-spread'],
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
        ],
      },
    },
  });

  return app.toTree();
};
