import { buildBaseURL } from '@warp-drive/utilities';
import type { Special } from '../schemas/special';

/**
 * Saves the order of the specials. The API responds with every special and its new
 * `displayOrder`, which the store applies to the records.
 */
export function reorderSpecials(specials: Special[]) {
  const url = buildBaseURL({ resourcePath: 'specials/reorder' });

  return {
    url,
    method: 'POST' as const,
    // The body is a list of ids, not a JSON:API document. This is the header `fetch` sent for it
    // before WarpDrive, and it stops `JsonApiHandler` from adding a JSON:API one.
    headers: new Headers({ 'Content-Type': 'text/plain;charset=UTF-8' }),
    body: JSON.stringify(specials.map((special) => ({ id: special.id }))),
  };
}
