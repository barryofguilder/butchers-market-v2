import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { query } from '../../../builders/query';
import type { MeatBundle } from '../../../schemas/meat-bundle';
import type Store from '../../../services/store';

export default class AdminMeatBundlesIndexRoute extends Route {
  @service declare store: Store;

  async model() {
    const { content } = await this.store.request(query<MeatBundle>('meat-bundle'));

    return content.data;
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
