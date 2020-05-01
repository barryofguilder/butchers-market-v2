import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminMeatBundlesIndexRoute extends Route {
  model() {
    return this.store.findAll('meat-bundle');
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
