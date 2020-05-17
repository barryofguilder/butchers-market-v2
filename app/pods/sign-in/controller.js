import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { TOKEN } from 'butchers-market/utils/local-storage';

export default class SignInController extends Controller {
  @service localStorage;
  @service router;

  previousTransitionOrUrl = null;

  @action
  authenticated(token) {
    this.localStorage.setItem(TOKEN, token);

    let previousTransitionOrUrl = this.previousTransitionOrUrl;

    if (previousTransitionOrUrl) {
      this.previousTransitionOrUrl = null;

      if (typeof previousTransitionOrUrl === 'string') {
        this.router.transitionTo(previousTransitionOrUrl);
      } else {
        previousTransitionOrUrl.retry();
      }
    } else {
      this.router.transitionTo('admin');
    }
  }
}
