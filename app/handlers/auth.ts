import { getOwner } from '@ember/owner';
import type { Handler, NextFn } from '@warp-drive/core/request';
import type { RequestContext } from '@warp-drive/core/types/request';
import type SessionService from '../services/session';
import { isUnauthorized } from '../utils/error-handling';

/**
 * Adds the session's bearer token to every request, and sends the user to sign-in when the API
 * responds with a 401. The error is rethrown so callers can stop what they were doing.
 */
export const AuthHandler: Handler = {
  async request<T>(context: RequestContext, next: NextFn<T>) {
    const owner = getOwner(context.request.store!)!;
    const session = owner.lookup('service:session') as SessionService;
    const headers = new Headers(context.request.headers);

    if (session.token) {
      headers.set('Authorization', `Bearer ${session.token}`);
    }

    try {
      return await next(Object.assign({}, context.request, { headers }));
    } catch (error) {
      if (isUnauthorized(error)) {
        const router = owner.lookup('service:router');
        session.redirectToSignIn(router.currentURL ?? '');
      }

      throw error;
    }
  },
};
