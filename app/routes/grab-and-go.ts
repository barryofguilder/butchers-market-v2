import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Store from '@ember-data/store';

export default class GrabAndGoRoute extends Route {
  @service declare store: Store;

  async model() {
    const holidayItems = this.store.query('grab-and-go', {
      filter: { inStock: true, isHoliday: true },
    });
    const regularItems = this.store.query('grab-and-go', {
      filter: { inStock: true, isHoliday: false },
    });

    const [holiday, regular] = await Promise.all([holidayItems, regularItems]);
    return { holidayItems: holiday, regularItems: regular };
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
