import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service features;

  async model() {
    await this.features.load();
  }
}
