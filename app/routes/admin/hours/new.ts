import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type { Hour } from '../../../schemas/hour';
import type Store from '../../../services/store';

export default class AdminHoursNewRoute extends Route {
  @service declare store: Store;

  model() {
    const now = new Date();
    const activeStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const activeEndDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    return this.store.createRecord<Hour>('hour', {
      activeStartDate,
      activeEndDate,
    });
  }

  @action
  willTransition(/*transition*/) {
    const hours = this.modelFor(this.routeName) as Hour;

    if (hours.hasDirtyAttributes) {
      hours.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
