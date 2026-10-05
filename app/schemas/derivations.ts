import type { Derivation } from '@warp-drive/core/types/schema/concepts';
import { Type } from '@warp-drive/core/types/symbols';
import { ORDER_ONLINE_URL, UPLOADS_DIR } from '../utils/config';

/**
 * Reads the field named in a derived field's `options.field`.
 */
function readField(record: unknown, options: unknown) {
  const { field } = options as { field: string };

  return (record as Record<string, unknown>)[field] as string | null;
}

/**
 * The full URL of an uploaded file, or `null` when there isn't one. `options.field` names the field
 * holding the file name.
 *
 * ```ts
 * { kind: 'derived', name: 'imageUrlPath', type: 'uploads-path', options: { field: 'imageUrl' } }
 * ```
 */
export const uploadsPath: Derivation = Object.assign(
  (record: unknown, options: unknown) => {
    const fileName = readField(record, options);

    return fileName ? `${UPLOADS_DIR}${fileName}` : null;
  },
  { [Type]: 'uploads-path' }
);

/**
 * The link in `options.field`, falling back to the online ordering site when it's blank.
 */
export const orderOnlineLink: Derivation = Object.assign(
  (record: unknown, options: unknown) => readField(record, options) || ORDER_ONLINE_URL,
  { [Type]: 'order-online-link' }
);
