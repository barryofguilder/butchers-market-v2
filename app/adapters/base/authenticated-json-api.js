import DefaultAdapter from './default-adapter';
import { inject as service } from '@ember/service';

export default class AuthenticatedJSONAPIAdapter extends DefaultAdapter {
  @service router;
  @service session;

  get headers() {
    const token = this.session.token;

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }

    return {};
  }

  handleResponse(status /*, headers, payload, requestData*/) {
    if (status === 401) {
      return this.session.redirectToSignIn(this.router.currentURL);
    }

    return super.handleResponse(...arguments);
  }
}
