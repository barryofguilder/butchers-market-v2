import Route from '@ember/routing/route';
import { action } from '@ember/object';
import RSVP from 'rsvp';

export default class IndexRoute extends Route {
  model() {
    return RSVP.hash({
      bundles: this.store.findAll('meat-bundle'),
      hours: this.store.findAll('hour'),
      products: this.store.findAll('meat-product'),
      reviews: this.store.findAll('review'),
    });
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
