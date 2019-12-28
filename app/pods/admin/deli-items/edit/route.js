import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminDeliItemsEditRoute extends Route {
  model(params) {
    return this.store.findRecord('deli-item', params.id);
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
