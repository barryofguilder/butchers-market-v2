import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type { Special } from '../../../schemas/special';
import type Store from '../../../services/store';

export default class AdminSpecialsNewRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.createRecord<Special>('special', {});
  }

  @action
  willTransition(/*transition*/) {
    const special = this.modelFor(this.routeName) as Special;

    if (special.hasDirtyAttributes) {
      special.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
