import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class AdminIndexRoute extends Route {
  @action
  willTransition(/*transition*/) {
    // Makes sure that the page gets scrolled to the top when changing routes.
    window.scrollTo(0, 0);
  }
}
