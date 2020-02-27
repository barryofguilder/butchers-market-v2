import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminEventsIndexRoute extends Route {
  queryParams = {
    page: {
      refreshModel: true,
    },
    range: {
      refreshModel: true,
    },
  };

  model(params) {
    return this.store.query('event', {
      filter: { range: params.range },
      page: { number: params.page },
    });
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
