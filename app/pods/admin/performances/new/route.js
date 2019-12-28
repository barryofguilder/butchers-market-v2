import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminPerformancesNewRoute extends Route {
  model() {
    return this.store.createRecord('performance');
  }

  @action
  willTransition(/*transition*/) {
    let performance = this.modelFor(this.routeName);

    if (performance.hasDirtyAttributes) {
      performance.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
