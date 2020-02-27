import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class IndexRoute extends Route {
  async model() {
    const bundles = await this.store.query('meat-bundle', { filter: { featured: true } });
    const hours = await this.store.findAll('hour');

    return {
      bundles,
      hours,
    };
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
