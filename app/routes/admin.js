import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { jwtDecode } from 'jwt-decode';
import { TOKEN } from '../utils/local-storage';

export default class AdminRoute extends Route {
  @service localStorage;
  @service session;

  beforeModel(transition) {
    try {
      const token = localStorage.getItem(TOKEN);
      const decodedToken = jwtDecode(token);

      this.session.updateToken(token, decodedToken);

      // Require sign in if the token has expired or if it expires in the next day.
      if (this.session.isTokenExpired() || this.session.doesTokenExpireToday()) {
        transition.abort();
        this.session.redirectToSignIn(transition);
      }
    } catch (error) {
      transition.abort();
      this.session.redirectToSignIn(transition);
    }
  }
}
