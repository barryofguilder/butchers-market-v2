import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AdminMeatBundlesNewRoute extends Route {
  @service store;

  async model() {
    // Loaded so the new bundle can be given a `displayOrder` that puts it at the end of the list.
    let bundles = await this.store.findAll('meat-bundle');
    let lastDisplayOrder = [...bundles].reduce(
      (max, bundle) => Math.max(max, bundle.displayOrder ?? 0),
      0
    );

    return this.store.createRecord('meat-bundle', {
      displayOrder: lastDisplayOrder + 1,
      featured: false,
      isHidden: false,
      orderEnabled: false,
      items: [],
    });
  }

  @action
  willTransition(/*transition*/) {
    let meatBundle = this.modelFor(this.routeName);

    if (meatBundle.hasDirtyAttributes) {
      meatBundle.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
