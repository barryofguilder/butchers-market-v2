import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Store from '../../../services/store';

export default class AdminPackageBundlesIndexRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.findAll('package-bundle');
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
