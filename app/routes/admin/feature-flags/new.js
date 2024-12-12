import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AdminFeatureFlagsNewRoute extends Route {
  @service store;

  model() {
    return this.store.createRecord('feature-flag');
  }

  @action
  willTransition(/*transition*/) {
    let item = this.modelFor(this.routeName);

    if (item.hasDirtyAttributes) {
      item.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
