'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'butchers-market',
    podModulePrefix: 'butchers-market/pods',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'ember-g-recaptcha': {
      sitekey: '6LcrHAITAAAAACvTiT4qS4dvbwL7wgGRXhJtsKim',
    },

    api: '',
    namespace: 'api',
    showReCaptcha: false,
    uploadsDir: '/uploads/',
    orderOnlineUrl: 'https://thebutchersmarketmeatanddeli.godaddysites.com/order-online',
    showOrderOnline: true,
    useMirage: process.env.USE_MIRAGE === 'true' ? true : false,
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.uploadsDir = '';

    if (!ENV.useMirage) {
      ENV.api = process.env.API_URL;
      ENV.uploadsDir = `${process.env.S3_BUCKET_UPLOADS}/uploads/`;
    }
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
    ENV.showReCaptcha = true;
    ENV.showOrderOnline = true;
    ENV.api = process.env.API_URL;
    ENV.uploadsDir = `${process.env.S3_BUCKET_UPLOADS}/uploads/`;
  }

  return ENV;
};
