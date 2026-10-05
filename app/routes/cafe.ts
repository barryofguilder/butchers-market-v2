import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

export default class CafeRoute extends Route {
  @service declare router: RouterService;

  beforeModel() {
    // For now, we are just redirecting to the main page.
    this.router.transitionTo('index');
  }
}
