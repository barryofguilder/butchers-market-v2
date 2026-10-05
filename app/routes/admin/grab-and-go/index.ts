import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { query } from '@warp-drive/utilities/json-api';
import type { GrabAndGo } from '../../../schemas/grab-and-go';
import type Store from '../../../services/store';

export default class GrabAndGoIndexRoute extends Route {
  @service declare store: Store;

  async model() {
    const { content } = await this.store.request(query<GrabAndGo>('grab-and-go'));

    return content.data;
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
