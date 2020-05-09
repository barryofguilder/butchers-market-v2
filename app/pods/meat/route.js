import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class MeatRoute extends Route {
  async model() {
    const bundles = await this.store.query('meat-bundle', { filter: { isHidden: false } });
    const packageBundles = await this.store.findAll('package-bundle');

    return {
      bundles,
      packageBundles,
    };
  }

  resetController(controller, isExiting /*, transition*/) {
    if (isExiting) {
      controller.packages = false;
    }
  }

  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
