import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import EmberApp from 'ember-cli/lib/broccoli/ember-app.js';
import { compatBuild } from '@embroider/compat';

const require = createRequire(import.meta.url);

export default async function (defaults) {
  const { setConfig } = await import('@warp-drive/core/build-config');
  const { buildOnce } = await import('@embroider/vite');

  const app = new EmberApp(defaults, {
    babel: {
      plugins: [require.resolve('ember-concurrency/async-arrow-task-transform')],
    },
  });

  setConfig(app, dirname(fileURLToPath(import.meta.url)), {
    // this should be the most recent <major>.<minor> version for
    // which all deprecations have been fully resolved
    // and should be updated when that changes
    compatWith: '5.8',
    deprecations: {
      // ... list individual deprecations that have been resolved here
      // Keeps store.findAll/query/findRecord and record.save() working until requests move to
      // store.request() with builders.
      ENABLE_LEGACY_REQUEST_METHODS: true,
    },
  });

  return compatBuild(app, buildOnce);
}
