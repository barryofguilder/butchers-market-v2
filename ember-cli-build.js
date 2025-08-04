'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const environment = process.env.EMBER_ENV || 'development';
const isProduction = environment === 'production';

module.exports = function (defaults) {
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
    'ember-composable-helpers': {
      only: ['sort-by'],
    },
    inlineContent: {},
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

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticEmberSource: true,
    // `ember-animated` blows up when this is turned on.
    staticInvokables: false,
    // splitAtRoutes: ['route.name'], // can also be a RegExp
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
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
