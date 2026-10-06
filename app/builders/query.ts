import type { TypedRecordInstance, TypeFromInstance } from '@warp-drive/core/types/record';
import type { ConstrainedRequestOptions } from '@warp-drive/core/types/request';
import type { QueryParamsSource } from '@warp-drive/core/types/params';
import { query as jsonApiQuery } from '@warp-drive/utilities/json-api';

/**
 * `query` from `@warp-drive/utilities/json-api`, plus the `cacheOptions.types` the store's cache
 * policy needs to drop the cached result when a record of `type` is created. Without it, a list
 * loaded before a create keeps being served from the cache without the new record. Use this
 * instead of the WarpDrive builder.
 */
export function query<T extends TypedRecordInstance>(
  type: TypeFromInstance<T>,
  params?: QueryParamsSource,
  options?: ConstrainedRequestOptions
) {
  const request = jsonApiQuery<T>(type, params, options);
  request.cacheOptions = { ...request.cacheOptions, types: [type] };

  return request;
}
