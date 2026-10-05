import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { query } from '@warp-drive/utilities/json-api';
import type { Special } from '../schemas/special';
import type Store from '../services/store';

export default class IndexRoute extends Route {
  @service declare store: Store;

  async model() {
    const bundles = await this.store.query('meat-bundle', {
      filter: { featured: true, isHidden: false },
    });
    const hours = await this.store.findAll('hour');
    const { content } = await this.store.request(
      query<Special>('special', { 'filter[isHidden]': false, 'filter[range]': 'active' })
    );
    const specials = content.data;

    return {
      bundles,
      hours,
      specials,
    };
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
