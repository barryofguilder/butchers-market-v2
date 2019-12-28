import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminPerformancesEditRoute extends Route {
  model(params) {
    return this.store.findRecord('performance', params.id);
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
