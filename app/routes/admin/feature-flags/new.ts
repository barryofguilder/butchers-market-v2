import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Model from '@warp-drive/legacy/model';
import type Store from '../../../services/store';

export default class AdminFeatureFlagsNewRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.createRecord('feature-flag', {});
  }

  @action
  willTransition(/*transition*/) {
    const item = this.modelFor(this.routeName) as Model;

    if (item.hasDirtyAttributes) {
      item.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
