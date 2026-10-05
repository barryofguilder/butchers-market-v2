import Service, { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import { addDays } from 'date-fns';

export type SessionPayload = {
  username: string;
  iat: number;
  exp: number;
};

export default class SessionService extends Service {
  @service declare router: RouterService;

  token: string | null = null;
  payload: SessionPayload | null = null;

  /**
   * Where to send the user once they sign in. Set when a protected route redirects them to sign-in.
   */
  previousTransitionOrUrl: Transition | string | null = null;

  get username() {
    return this.payload ? this.payload.username : null;
  }

  updateToken(token: string, decodedToken: SessionPayload) {
    this.token = token;
    this.payload = decodedToken;
  }

  isTokenAlive() {
    const now = Date.now() / 1000;
    return this.payload && this.payload.exp > now;
  }

  isTokenExpired() {
    return !this.isTokenAlive();
  }

  doesTokenExpireToday() {
    if (this.payload === null) {
      return true;
    }

    const expireDate = new Date(this.payload.exp * 1000);
    const dayFromNow = addDays(new Date(), 1);

    return expireDate < dayFromNow;
  }

  redirectToSignIn(transitionOrUrl: Transition | string) {
    this.previousTransitionOrUrl = transitionOrUrl;
    this.router.transitionTo('sign-in');
  }
}
