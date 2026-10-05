import type { Handler, NextFn } from '@warp-drive/core/request';
import type { RequestContext } from '@warp-drive/core/types/request';
import { singularize } from '@warp-drive/utilities/string';

interface ResourceObject {
  type: string;
}

interface Document {
  data?: ResourceObject | ResourceObject[] | null;
  included?: ResourceObject[];
}

function singularizeTypes(resources: ResourceObject[]) {
  for (const resource of resources) {
    resource.type = singularize(resource.type);
  }
}

/**
 * Matches requests and responses to the API's JSON:API format, which the legacy adapter and
 * serializer used to do:
 *
 * - Requests with a body get a JSON:API `Content-Type`. The request builders only set `Accept`,
 *   and without a JSON `Content-Type` the API doesn't parse the body.
 * - The API uses plural resource types (`specials`) but the store's schemas are singular
 *   (`special`), so the types in each response are singularized before the store caches it.
 */
export const JsonApiHandler: Handler = {
  async request<T>(context: RequestContext, next: NextFn<T>) {
    let request = context.request;

    if (request.body && !request.headers?.has('Content-Type')) {
      const headers = new Headers(request.headers);
      headers.set('Content-Type', 'application/vnd.api+json');
      request = Object.assign({}, request, { headers });
    }

    const response = await next(request);
    const content = response.content as Document | null | undefined;

    if (content && typeof content === 'object') {
      if (Array.isArray(content.data)) {
        singularizeTypes(content.data);
      } else if (content.data) {
        singularizeTypes([content.data]);
      }

      singularizeTypes(content.included ?? []);
    }

    return response;
  },
};
