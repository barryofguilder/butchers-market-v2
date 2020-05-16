import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { TOKEN } from 'butchers-market/utils/local-storage';
import * as jwt_decode from 'jwt-decode';

export default class AdminRoute extends Route {
  @service localStorage;

  beforeModel(transition) {
    try {
      const token = localStorage.getItem(TOKEN);
      const decoded = jwt_decode(token);

      // TODO: Store decoded token
      console.log({ decoded });
    } catch (error) {
      // TODO: Store transition for later
      transition.abort();
      this.transitionTo('sign-in');
    }
  }
}
