import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { TOKEN } from 'butchers-market/utils/local-storage';
import * as jwt_decode from 'jwt-decode';

export default class AdminRoute extends Route {
  @service localStorage;
  @service session;

  beforeModel(transition) {
    try {
      const token = localStorage.getItem(TOKEN);
      const decodedToken = jwt_decode(token);

      this.session.updateToken(token, decodedToken);

      // TODO: Verify that the token hasn't expired
    } catch (error) {
      transition.abort();

      this._transitionToSignIn(transition);
    }
  }

  _transitionToSignIn(transition) {
    const controller = this.controllerFor('sign-in');
    controller.previousTransition = transition;

    this.transitionTo('sign-in');
  }
}
