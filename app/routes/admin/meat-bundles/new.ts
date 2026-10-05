import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Model from '@ember-data/model';
import type Store from '@ember-data/store';

export default class AdminMeatBundlesNewRoute extends Route {
  @service declare store: Store;

  model() {
    // `displayOrder` is assigned by the API on create.
    return this.store.createRecord('meat-bundle', {
      featured: false,
      isHidden: false,
      orderEnabled: false,
      items: [],
    });
  }

  @action
  willTransition(/*transition*/) {
    const meatBundle = this.modelFor(this.routeName) as Model;

    if (meatBundle.hasDirtyAttributes) {
      meatBundle.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
