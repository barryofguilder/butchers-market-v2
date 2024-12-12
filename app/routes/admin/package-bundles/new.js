import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AdminPackageBundlesNewRoute extends Route {
  @service store;

  model() {
    return this.store.createRecord('package-bundle', { prices: [], items: [] });
  }

  @action
  willTransition(/*transition*/) {
    let packageBundle = this.modelFor(this.routeName);

    if (packageBundle.hasDirtyAttributes) {
      packageBundle.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
