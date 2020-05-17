import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { TOKEN } from 'butchers-market/utils/local-storage';

export default class SignInController extends Controller {
  @service localStorage;
  @service router;

  @action
  authenticated(token) {
    this.localStorage.setItem(TOKEN, token);

    let transition = this.previousTransition;

    if (transition) {
      this.previousTransition = null;
      transition.retry();
    } else {
      this.router.transitionTo('admin');
    }
  }
}
