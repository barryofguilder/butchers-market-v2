import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/utilities/json-api';
import type { DeliItem } from '../../../schemas/deli-item';
import type Store from '../../../services/store';

export default class AdminDeliItemsEditRoute extends Route {
  @service declare store: Store;

  async model(params: { id: string }) {
    const { content } = await this.store.request(findRecord<DeliItem>('deli-item', params.id));

    return content.data;
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
