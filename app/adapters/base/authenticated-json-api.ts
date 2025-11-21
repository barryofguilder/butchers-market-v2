import type RouterService from '@ember/routing/router-service';
import DefaultAdapter from './default-adapter';
import { service } from '@ember/service';
import type SessionService from '../../services/session';

export default class AuthenticatedJSONAPIAdapter extends DefaultAdapter {
  @service declare router: RouterService;
  @service declare session: SessionService;

  get headers() {
    const token = this.session.token;

    return {
      Authorization: token ? `Bearer ${token}` : '',
    };
  }

  handleResponse(status: number, headers: {}, payload: {}, requestData: {}) {
    if (status === 401) {
      this.session.redirectToSignIn(this.router.currentURL);
      return {};
    }

    return super.handleResponse(status, headers, payload, requestData);
  }
}
