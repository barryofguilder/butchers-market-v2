import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { importSync, isDevelopingApp, isTesting, macroCondition } from '@embroider/macros';
import type FeaturesService from '../services/features';
import { USE_MIRAGE } from '../utils/config';

export default class ApplicationRoute extends Route {
  @service declare features: FeaturesService;

  beforeModel() {
    if (macroCondition(isDevelopingApp() && !isTesting())) {
      if (USE_MIRAGE) {
        const { makeServer } = importSync(
          'butchers-market/mirage/servers/default'
        ) as typeof import('butchers-market/mirage/servers/default');
        const server = makeServer({ environment: 'development' });
        server.logging = true;
      }
    }
  }

  async model() {
    await this.features.load();
  }
}
