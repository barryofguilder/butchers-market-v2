'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      exclude: ['apple-touch-icon.png', 'images/*.*']
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  // Bootstrap dependency for dropdowns
  //app.import('node_modules/popper.js/dist/umd/popper.js');

  // Bootstrap
  app.import('node_modules/bootstrap/js/dist/util.js');
  //app.import('bower_components/bootstrap/js/dist/alert.js');
  //app.import('node_modules/bootstrap/js/dist/button.js');
  app.import('node_modules/bootstrap/js/dist/carousel.js');
  //app.import('node_modules/bootstrap/js/dist/collapse.js');
  //app.import('node_modules/bootstrap/js/dist/dropdown.js');
  //app.import('node_modules/bootstrap/js/dist/modal.js');
  //app.import('node_modules/bootstrap/js/dist/tooltip.js');
  //app.import('node_modules/bootstrap/js/dist/popover.js');
  //app.import('node_modules/bootstrap/js/dist/scrollspy.js');
  //app.import('node_modules/bootstrap/js/dist/tab.js');

  return app.toTree();
};
