import Model, { attr } from '@ember-data/model';
import config from 'butchers-market/config/environment';

export default class DeliItem extends Model {
  @attr('string') title;
  @attr('string') imageUrl;
  @attr('string') ingredients;

  get imageUrlPath() {
    if (this.imageUrl) {
      return `${config.uploadsDir}${this.imageUrl}`;
    }

    return null;
  }
}
