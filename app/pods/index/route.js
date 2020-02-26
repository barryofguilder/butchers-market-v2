import Route from '@ember/routing/route';
import { action } from '@ember/object';
import RSVP from 'rsvp';

export default class IndexRoute extends Route {
  model() {
    return RSVP.hash({
      bundles: this.store.query('meat-bundle', { filter: { featured: true } }),
      hours: this.store.findAll('hour'),
      products: this.store.findAll('meat-product'),
    });
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
