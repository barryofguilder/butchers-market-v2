import { setupMirage as upstreamSetupMirage } from 'ember-mirage/test-support';
import { makeServer } from 'butchers-market/mirage/servers/default';

export function setupMirage(hooks, options) {
  options = options || {};
  options.createServer = options.makeServer || makeServer;

  upstreamSetupMirage(hooks, {
    ...options,
    config: {
      ...options.config,
      environment: 'test',
    },
  });
}
