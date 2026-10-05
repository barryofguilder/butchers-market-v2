import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Store from '../services/store';

export default class DeliRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.query('deli-item', { filter: { isHidden: false } });
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
