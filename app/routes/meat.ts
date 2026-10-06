import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { query } from '../builders/query';
import type { MeatBundle } from '../schemas/meat-bundle';
import type { PackageBundle } from '../schemas/package-bundle';
import type Store from '../services/store';
import type MeatController from '../controllers/meat';

export default class MeatRoute extends Route {
  @service declare store: Store;

  async model() {
    const bundles = (
      await this.store.request(query<MeatBundle>('meat-bundle', { 'filter[isHidden]': false }))
    ).content.data;
    const packageBundles = (await this.store.request(query<PackageBundle>('package-bundle')))
      .content.data;

    return {
      bundles,
      packageBundles,
    };
  }

  resetController(controller: MeatController, isExiting: boolean /*, transition*/) {
    if (isExiting) {
      controller.packages = false;
    }
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
