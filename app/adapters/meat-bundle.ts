import { service } from '@ember/service';
import type Store from 'ember-data/store';
import ApplicationAdapter from './application';
import type MeatBundleModel from '../models/meat-bundle';

export default class MeatBundleAdapter extends ApplicationAdapter {
  @service declare store: Store;

  async reorderMeatBundles(meatBundles: MeatBundleModel[]) {
    const url = `${this.host}/${this.namespace}/meat-bundles/reorder`;
    const meatBundleData = meatBundles.map((meatBundle) => {
      return { id: meatBundle.id };
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(meatBundleData),
    });

    // The endpoint responds with every bundle and its newly assigned `displayOrder`. Pushing that
    // into the store updates the canonical state, which in turn discards the local changes made
    // while dragging so the records don't stay dirty.
    if (response.ok) {
      this.store.pushPayload('meat-bundle', await response.json());
    }

    return response;
  }
}
