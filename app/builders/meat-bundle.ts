import { buildBaseURL } from '@warp-drive/utilities';
import type { MeatBundle } from '../schemas/meat-bundle';

/**
 * Saves the order of the meat bundles. The API responds with every bundle and its new
 * `displayOrder`, which the store applies to the records.
 */
export function reorderMeatBundles(bundles: MeatBundle[]) {
  const url = buildBaseURL({ resourcePath: 'meat-bundles/reorder' });

  return {
    url,
    method: 'POST' as const,
    // The body is a list of ids, not a JSON:API document. This is the header `fetch` sent for it
    // before WarpDrive, and it stops `JsonApiHandler` from adding a JSON:API one.
    headers: new Headers({ 'Content-Type': 'text/plain;charset=UTF-8' }),
    body: JSON.stringify(bundles.map((bundle) => ({ id: bundle.id }))),
  };
}
