import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminPackageBundlesEditRoute extends Route {
  model(params) {
    return this.store.findRecord('package-bundle', params.id);
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
