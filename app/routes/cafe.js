import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CafeRoute extends Route {
  @service router;

  beforeModel() {
    // For now, we are just redirecting to the main page.
    this.router.transitionTo('index');
  }
}
