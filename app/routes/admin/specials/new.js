import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AdminSpecialsNewRoute extends Route {
  @service store;

  model() {
    return this.store.createRecord('special');
  }

  @action
  willTransition(/*transition*/) {
    let special = this.modelFor(this.routeName);

    if (special.hasDirtyAttributes) {
      special.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
