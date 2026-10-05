import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type { DeliItem } from '../../../schemas/deli-item';
import type Store from '../../../services/store';

export default class AdminDeliItemsNewRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.createRecord<DeliItem>('deli-item', {});
  }

  @action
  willTransition(/*transition*/) {
    const item = this.modelFor(this.routeName) as DeliItem;

    if (item.hasDirtyAttributes) {
      item.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
