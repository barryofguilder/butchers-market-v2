'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['apple-touch-icon.png', 'images/*.*'],
    },

    postcssOptions: {
      compile: {
        plugins: [require('tailwindcss')('app/tailwind/config.js')],
      },
    },
  });

  return app.toTree();
};
