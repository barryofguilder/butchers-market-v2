import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AdminFeatureFlagsEditRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('feature-flag', params.id);
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
