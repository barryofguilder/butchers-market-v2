import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class GrabAndGoSocialRoute extends Route {
  @service store;

  model() {
    return this.store.query('grab-and-go', { filter: { inStock: true } });
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
