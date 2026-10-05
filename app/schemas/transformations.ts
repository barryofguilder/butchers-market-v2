import type { Transformation } from '@warp-drive/core/reactive';
import { Type } from '@warp-drive/core/types/symbols';

/**
 * Converts between the API's ISO 8601 strings and `Date`s. Use it with `{ kind: 'field', type:
 * 'date' }`.
 */
export const DateTransformation: Transformation<string | null, Date | null> = {
  serialize(value) {
    return value ? value.toISOString() : null;
  },

  hydrate(value) {
    return value ? new Date(value) : null;
  },

  [Type]: 'date',
};
