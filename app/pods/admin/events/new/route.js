import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminEventsNewRoute extends Route {
  model() {
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19);
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22);

    return this.store.createRecord('event', {
      startTime,
      endTime,
    });
  }

  @action
  willTransition(/*transition*/) {
    let event = this.modelFor(this.routeName);

    if (event.hasDirtyAttributes) {
      event.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
