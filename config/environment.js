/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'butchers-market',
    environment: environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    gReCaptcha: {
      siteKey: '6LcrHAITAAAAACvTiT4qS4dvbwL7wgGRXhJtsKim'
    },

    api: ''
  };

  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    'script-src': ["'self'", "localhost:*", "https://www.google.com/recaptcha/", "https://www.gstatic.com/recaptcha/", "https://www.foodbooking.com"],
    'font-src': ["'self'", "localhost:*", "http://fonts.googleapis.com", "http://fonts.gstatic.com"],
    'connect-src': ["'self'", "localhost:*", "*.thebutchersmarket.com", "https://www.foodbooking.com/api/"],
    'img-src': ["'self'", "localhost:*"],
    'style-src': ["'self'", "'unsafe-inline'", "localhost:*", "http://fonts.googleapis.com", "https://www.foodbooking.com"],
    'frame-src': ["'self'", "https://www.google.com/recaptcha/", "https://www.foodbooking.com/", "https://www.youtube.com/embed/"],
    'object-src': ["'self'", "localhost:*"],
    'media-src': null
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.rootURL = '/new_butch_2/';
    ENV.api = 'http://thebutchersmarket.com/new_butch_2';
  }

  return ENV;
};
