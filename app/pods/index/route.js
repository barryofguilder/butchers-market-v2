import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class IndexRoute extends Route {
  async model() {
    const bundles = await this.store.query('meat-bundle', {
      filter: { featured: true, isHidden: false },
    });
    const hours = await this.store.findAll('hour');
    const specials = await this.store.query('special', {
      filter: { isHidden: false, range: 'active' },
    });

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
