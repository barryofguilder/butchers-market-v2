'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['apple-touch-icon.png', 'images/*.*'],
    },

    'ember-composable-helpers': {
      only: ['sort-by'],
    },

    postcssOptions: {
      compile: {
        plugins: [
          require('postcss-import')({ path: ['node_modules'] }),
          require('tailwindcss')('app/tailwind.config.js'),
          require('autoprefixer'),
        ],
        cacheInclude: [/.*\.(css|hbs|html|js)$/, /.tailwind\.config\.js$/],
      },
    },
  });

  return app.toTree();
};
