import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Transition from '@ember/routing/transition';
import { jwtDecode } from 'jwt-decode';
import type LocalStorageService from '../services/local-storage';
import type SessionService from '../services/session';
import type { SessionPayload } from '../services/session';
import { TOKEN } from '../utils/local-storage';

export default class AdminRoute extends Route {
  @service declare localStorage: LocalStorageService;
  @service declare session: SessionService;

  beforeModel(transition: Transition) {
    try {
      const token = this.localStorage.getItem(TOKEN);
      if (!token) {
        throw new Error('No session token');
      }

      const decodedToken = jwtDecode<SessionPayload>(token);

      this.session.updateToken(token, decodedToken);

      // Require sign in if the token has expired or if it expires in the next day.
      if (this.session.isTokenExpired() || this.session.doesTokenExpireToday()) {
        transition.abort();
        this.session.redirectToSignIn(transition);
      }
    } catch {
      transition.abort();
      this.session.redirectToSignIn(transition);
    }
  }
}
