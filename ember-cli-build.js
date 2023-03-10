'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const environment = process.env.EMBER_ENV || 'development';
const isProduction = environment === 'production';

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    'ember-composable-helpers': {
      only: ['sort-by'],
    },

    inlineContent: {},

    postcssOptions: {
      compile: {
        plugins: [
          require('postcss-import')({ path: ['node_modules'] }),
          require('tailwindcss')('app/tailwind.config.js'),
          require('autoprefixer'),
        ],
        // you need this otherwise we won't recompile on changes in the `app`-tree
        includePaths: ['app'],
        cacheInclude: [/.*\.(css|hbs|html|js)$/, /.tailwind\.config\.js$/],
      },
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

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    // `ember-animated` blows up when this is turned on.
    // staticHelpers: true,
    staticModifiers: true,
    // `ember-modal-dialog` blows up when this is turned on.
    // staticComponents: true,
    // splitAtRoutes: ['route.name'], // can also be a RegExp
    // packagerOptions: {
    //    webpackConfig: { }
    // }
  });
};
