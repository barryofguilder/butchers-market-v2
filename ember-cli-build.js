'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const environment = process.env.EMBER_ENV || 'development';
const isProduction = environment === 'production';

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    'ember-cli-babel': { enableTypeScriptTransform: true },

    'ember-composable-helpers': {
      only: ['sort-by'],
    },

    inlineContent: {},

    postcssOptions: {
      compile: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
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
    // Blows up on the yielded components. Figure out how to fix.
    // staticComponents: true,
    // splitAtRoutes: ['route.name'], // can also be a RegExp
    // packagerOptions: {
    //    webpackConfig: { }
    // }
  });
};
