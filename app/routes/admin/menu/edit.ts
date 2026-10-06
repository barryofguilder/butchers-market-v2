import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/utilities/json-api';
import type { Menu } from '../../../schemas/menu';
import type Store from '../../../services/store';

export default class AdminMenuEditRoute extends Route {
  @service declare store: Store;

  async model(params: { id: string }) {
    const { content } = await this.store.request(findRecord<Menu>('menu', params.id));

    return content.data;
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
