// @ts-expect-error: There are no types for this.
import { setupMirage as upstreamSetupMirage } from 'ember-mirage/test-support';
import { makeServer } from 'butchers-market/mirage/servers/default';

interface SetupMirageOptions {
  makeServer?: typeof makeServer;
  config?: Record<string, unknown>;
}

export function setupMirage(hooks: NestedHooks, options: SetupMirageOptions = {}) {
  upstreamSetupMirage(hooks, {
    ...options,
    createServer: options.makeServer || makeServer,
    config: {
      ...options.config,
      environment: 'test',
    },
  });
}
