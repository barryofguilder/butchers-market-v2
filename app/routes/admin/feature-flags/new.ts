import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type { FeatureFlag } from '../../../schemas/feature-flag';
import type Store from '../../../services/store';

export default class AdminFeatureFlagsNewRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.createRecord<FeatureFlag>('feature-flag', {});
  }

  @action
  willTransition(/*transition*/) {
    const item = this.modelFor(this.routeName) as FeatureFlag;

    if (item.hasDirtyAttributes) {
      item.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
