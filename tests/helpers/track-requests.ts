export interface TrackedRequest {
  method: string;
  url: string;
  requestHeaders: Record<string, string>;
  requestBody: string;
}

interface MirageServer {
  pretender: {
    handledRequest: (verb: string, path: string, request: TrackedRequest) => void;
  };
}

/**
 * Records every request Mirage handles, so a test can check what was sent to the API. Mirage
 * doesn't keep them itself. Call it before the requests are made.
 *
 * ```ts
 * const requests = trackRequests(this.server);
 * ```
 */
export function trackRequests(server: unknown) {
  const { pretender } = server as MirageServer;
  const requests: TrackedRequest[] = [];
  const handledRequest = pretender.handledRequest;

  pretender.handledRequest = function (verb, path, request) {
    requests.push(request);
    handledRequest.call(this, verb, path, request);
  };

  return requests;
}

/**
 * Finds the request that was sent with `method` to a URL ending in `path`.
 */
export function findRequest(requests: TrackedRequest[], method: string, path: string) {
  return requests.find((request) => request.method === method && request.url.endsWith(path));
}

/**
 * Reads a request header, ignoring the case of its name.
 */
export function requestHeader(request: TrackedRequest, name: string) {
  const key = Object.keys(request.requestHeaders).find(
    (key) => key.toLowerCase() === name.toLowerCase()
  );

  return key ? request.requestHeaders[key] : undefined;
}
