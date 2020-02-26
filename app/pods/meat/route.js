import Route from '@ember/routing/route';
import { action } from '@ember/object';
import RSVP from 'rsvp';

export default class MeatRoute extends Route {
  model() {
    return RSVP.hash({
      bundles: this.store.findAll('meat-bundle'),
      packageBundles: this.store.findAll('package-bundle'),
    });
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
