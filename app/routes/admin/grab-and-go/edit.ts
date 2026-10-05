import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Store from '../../../services/store';

export default class AdminGrabAndGoEditRoute extends Route {
  @service declare store: Store;

  model(params: { id: string }) {
    return this.store.findRecord('grab-and-go', params.id);
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
