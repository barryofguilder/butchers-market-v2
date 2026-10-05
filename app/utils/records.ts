import { cacheKeyFor } from '@warp-drive/core';
import {
  createRecord,
  deleteRecord,
  serializeResources,
  updateRecord,
} from '@warp-drive/utilities/json-api';
import { pluralize } from '@warp-drive/utilities/string';
import type Store from '../services/store';

interface PersistedRecord {
  isNew: boolean;
  rollbackAttributes(): void;
}

/**
 * Saves a record with a POST when it is new, or a PATCH of all its attributes otherwise. The
 * response updates the record in the store. The body matches what the legacy `JSONAPIAdapter` sent.
 */
export async function saveRecord(store: Store, record: PersistedRecord) {
  const request = record.isNew ? createRecord(record) : updateRecord(record, { patch: true });
  const { data } = serializeResources(store.cache, cacheKeyFor(record)) as {
    data: { type: string; lid?: string };
  };

  // The `lid` is the store's own key for the record; the API doesn't need it.
  delete data.lid;
  data.type = pluralize(data.type);
  request.body = JSON.stringify({ data });

  await store.request(request);
}

/**
 * Deletes a record with a DELETE request. If the request fails the record is restored, so it can
 * still be shown and deleted again.
 */
export async function destroyRecord(store: Store, record: PersistedRecord) {
  store.deleteRecord(record);

  try {
    await store.request(deleteRecord(record));
  } catch (error) {
    record.rollbackAttributes();
    throw error;
  }
}
