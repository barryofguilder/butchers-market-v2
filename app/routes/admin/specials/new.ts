import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Model from '@ember-data/model';
import type Store from '@ember-data/store';

export default class AdminSpecialsNewRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.createRecord('special', {});
  }

  @action
  willTransition(/*transition*/) {
    const special = this.modelFor(this.routeName) as Model;

    if (special.hasDirtyAttributes) {
      special.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
