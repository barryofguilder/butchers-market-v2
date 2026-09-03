import { service } from '@ember/service';
import type Store from 'ember-data/store';
import ApplicationAdapter from './application';
import type SpecialModel from '../models/special';

export default class SpecialAdapter extends ApplicationAdapter {
  @service declare store: Store;

  async reorderSpecials(specials: SpecialModel[]) {
    const url = `${this.host}/${this.namespace}/specials/reorder`;
    const specialData = specials.map((special) => {
      return { id: special.id };
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(specialData),
    });

    // The endpoint responds with every special and its newly assigned `displayOrder`. Pushing that
    // into the store updates the canonical state, which in turn discards the local changes made
    // while dragging so the records don't stay dirty.
    if (response.ok) {
      this.store.pushPayload('special', await response.json());
    }

    return response;
  }
}
