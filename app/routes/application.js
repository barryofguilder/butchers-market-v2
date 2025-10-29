import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { importSync, isDevelopingApp, isTesting, macroCondition } from '@embroider/macros';
import config from 'butchers-market/config/environment';

export default class ApplicationRoute extends Route {
  @service features;

  async beforeModel() {
    if (macroCondition(isDevelopingApp() && !isTesting())) {
      if (config.useMirage) {
        const { makeServer } = importSync('butchers-market/mirage/servers/default');
        const server = makeServer({ environment: 'development' });
        server.logging = true;
      }
    }
  }

  async model() {
    await this.features.load();
  }
}
