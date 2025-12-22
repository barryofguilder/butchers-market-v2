'use strict';
require('dotenv').config();

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const environment = process.env.EMBER_ENV || 'development';
const isProduction = environment === 'production';

const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');

  const app = new EmberApp(defaults, {
    babel: {
      plugins: [require.resolve('ember-concurrency/async-arrow-task-transform')],
    },
    emberData: {
      deprecations: {
        // New projects can safely leave this deprecation disabled.
        // If upgrading, to opt-into the deprecated behavior, set this to true and then follow:
        // https://deprecations.emberjs.com/id/ember-data-deprecate-store-extends-ember-object
        // before upgrading to Ember Data 6.0
        DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
      },
    },
    'ember-cli-babel': { enableTypeScriptTransform: true },

    inlineContent: {},
  });

  const { setConfig } = await import('@warp-drive/build-config');
  setConfig(app, __dirname, {
    deprecations: {
      DEPRECATE_TRACKING_PACKAGE: false,
    },
  });

  if (isProduction) {
    app.options.inlineContent.analytics = {
      content: `
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-F0503M6K3V"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-F0503M6K3V');
        </script>
      `,
    };
  }

  return compatBuild(app, buildOnce, {
    // `ember-animated` blows up when this is turned on.
    // Blows up on the yielded components. Figure out how to fix.
    staticInvokables: false,

    // splitAtRoutes: ['route.name'], // can also be a RegExp
    staticAppPaths: ['mirage'],

    packagerOptions: {
      webpackConfig: {
        module: {
          rules: [
            {
              test: /\.css$/i,
              use: [
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      config: 'postcss.config.js',
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    },
  });
};
