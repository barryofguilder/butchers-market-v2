import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/utilities/json-api';
import type { GrabAndGo } from '../../../schemas/grab-and-go';
import type Store from '../../../services/store';

export default class AdminGrabAndGoEditRoute extends Route {
  @service declare store: Store;

  async model(params: { id: string }) {
    const { content } = await this.store.request(findRecord<GrabAndGo>('grab-and-go', params.id));

    return content.data;
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
