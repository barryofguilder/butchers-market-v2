import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { query } from '../../../builders/query';
import type { Hour } from '../../../schemas/hour';
import type Store from '../../../services/store';

export default class AdminHoursIndexRoute extends Route {
  @service declare store: Store;

  async model() {
    const { content } = await this.store.request(query<Hour>('hour'));

    return content.data;
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
