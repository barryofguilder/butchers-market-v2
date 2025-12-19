import ApplicationAdapter from './application';
import type SpecialModel from '../models/special';

export default class SpecialAdapter extends ApplicationAdapter {
  reorderSpecials(specials: SpecialModel[]) {
    const url = `${this.host}/${this.namespace}/specials/reorder`;
    const specialData = specials.map((special) => {
      return { id: special.id };
    });

    return fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(specialData),
    });
  }
}
