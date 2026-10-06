import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type { PackageBundle } from '../../../schemas/package-bundle';
import type Store from '../../../services/store';

export default class AdminPackageBundlesNewRoute extends Route {
  @service declare store: Store;

  model() {
    return this.store.createRecord<PackageBundle>('package-bundle', { prices: [], items: [] });
  }

  @action
  willTransition(/*transition*/) {
    const packageBundle = this.modelFor(this.routeName) as PackageBundle;

    if (packageBundle.hasDirtyAttributes) {
      packageBundle.rollbackAttributes();
    }

    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
