import type RouterService from '@ember/routing/router-service';
import DefaultAdapter from './default-adapter';
import { service } from '@ember/service';
import type { RequestData } from '@ember-data/adapter/rest';
import type SessionService from '../../services/session';

type Payload = Error | Record<string, unknown> | unknown[] | string | undefined;

export default class AuthenticatedJSONAPIAdapter extends DefaultAdapter {
  @service declare router: RouterService;
  @service declare session: SessionService;

  // @ts-expect-error overring with a getter.
  get headers() {
    const token = this.session.token;

    return {
      Authorization: token ? `Bearer ${token}` : '',
    };
  }

  handleResponse(
    status: number,
    headers: Record<string, string>,
    payload: Payload,
    requestData: RequestData,
  ) {
    if (status === 401) {
      this.session.redirectToSignIn(this.router.currentURL ?? '');
      return {};
    }

    return super.handleResponse(status, headers, payload, requestData);
  }
}
