import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class DeliRoute extends Route {
  model() {
    return this.store.findAll('deli-item');
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
