import Component from '@glimmer/component';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type LocalStorageService from '../services/local-storage';
import type SessionService from '../services/session';
import { TOKEN } from '../utils/local-storage';
import Container from '../components/container';
import SignInForm from '../components/sign-in-form';

export default class SignInTemplate extends Component {
  @service declare localStorage: LocalStorageService;
  @service declare router: RouterService;
  @service declare session: SessionService;

  authenticated = (token: string) => {
    this.localStorage.setItem(TOKEN, token);

    const previousTransitionOrUrl = this.session.previousTransitionOrUrl;

    if (previousTransitionOrUrl) {
      this.session.previousTransitionOrUrl = null;

      if (typeof previousTransitionOrUrl === 'string') {
        this.router.transitionTo(previousTransitionOrUrl);
      } else {
        previousTransitionOrUrl.retry();
      }
    } else {
      this.router.transitionTo('admin');
    }
  };

  <template>
    <div class="mt-32">
      <Container>
        <SignInForm @onAuthenticated={{this.authenticated}} />
      </Container>
    </div>
  </template>
}
