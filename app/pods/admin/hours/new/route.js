import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminHoursNewRoute extends Route {
  model() {
    return this.store.createRecord('hour');
  }

  @action
  willTransition(/*transition*/) {
    let hours = this.modelFor(this.routeName);

    if (hours.hasDirtyAttributes) {
      hours.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
