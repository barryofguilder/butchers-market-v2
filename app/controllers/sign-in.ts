import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import type LocalStorageService from '../services/local-storage';
import { TOKEN } from '../utils/local-storage';

export default class SignInController extends Controller {
  @service declare localStorage: LocalStorageService;
  @service declare router: RouterService;

  previousTransitionOrUrl: Transition | string | null = null;

  @action
  authenticated(token: string) {
    this.localStorage.setItem(TOKEN, token);

    const previousTransitionOrUrl = this.previousTransitionOrUrl;

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
