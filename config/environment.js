'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'butchers-market',
    podModulePrefix: 'butchers-market/pods',
    environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: 'UA-59988645-1',
          // Use `analytics_debug.js` in development
          debug: environment === 'development',
          // Ensure only production env hits are sent to GA
          sendHitTask: environment === 'production'
        }
      }
    ],

    gReCaptcha: {
      siteKey: '6LcrHAITAAAAACvTiT4qS4dvbwL7wgGRXhJtsKim'
    },

    api: '',
    showReCaptcha: true
  };

  ENV['ember-body-class'] = {
    includeRouteName: false
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.showReCaptcha = false;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.api = '/';
  }

  return ENV;
};
