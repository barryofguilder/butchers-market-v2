import Service, { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import addDays from 'date-fns/addDays';

export default class SessionService extends Service {
  @service router;

  token = null;
  payload = null;

  get email() {
    return this.payload ? this.payload.email : null;
  }

  get name() {
    return this.payload ? this.payload.name : null;
  }

  updateToken(token, decodedToken) {
    this.token = token;
    this.payload = decodedToken;
  }

  isTokenAlive() {
    const now = Date.now() / 1000;
    return this.payload.exp > now;
  }

  isTokenExpired() {
    return !this.isTokenAlive();
  }

  doesTokenExpireToday() {
    const expireDate = new Date(this.payload.exp * 1000);
    const dayFromNow = addDays(new Date(), 1);

    return expireDate < dayFromNow;
  }

  redirectToSignIn(transitionOrUrl) {
    const owner = getOwner(this);
    const controller = owner.lookup('controller:sign-in');
    controller.previousTransitionOrUrl = transitionOrUrl;

    this.router.transitionTo('sign-in');
  }
}
