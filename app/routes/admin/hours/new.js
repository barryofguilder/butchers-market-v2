import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AdminHoursNewRoute extends Route {
  @service store;

  model() {
    const now = new Date();
    const activeStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const activeEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    return this.store.createRecord('hour', {
      activeStartDate,
      activeEndDate,
    });
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
