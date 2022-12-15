import ApplicationAdapter from './application';
import fetch from 'fetch';

export default class SpecialAdapter extends ApplicationAdapter {
  reorderSpecials(specials) {
    const baseUrl = this.buildURL();
    const url = `${baseUrl}/specials/reorder`;
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
