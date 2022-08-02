import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AdminDeliItemsNewRoute extends Route {
  @service store;

  model() {
    return this.store.createRecord('deli-item');
  }

  @action
  willTransition(/*transition*/) {
    let item = this.modelFor(this.routeName);

    if (item.hasDirtyAttributes) {
      item.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
