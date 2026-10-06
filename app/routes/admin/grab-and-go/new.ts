import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type { GrabAndGo } from '../../../schemas/grab-and-go';
import type Store from '../../../services/store';

export default class AdminGrabAndGoNewRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.createRecord<GrabAndGo>('grab-and-go', {});
  }

  @action
  willTransition(/*transition*/) {
    const special = this.modelFor(this.routeName) as GrabAndGo;

    if (special.hasDirtyAttributes) {
      special.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
