import Model, { attr } from '@ember-data/model';
import config from 'butchers-market/config/environment';

export default class Event extends Model {
  @attr('string') title;
  @attr('string') leadIn;
  @attr('date') startTime;
  @attr('date') endTime;
  @attr('string') link;
  @attr('string') imageUrl;

  get imageUrlPath() {
    if (this.imageUrl) {
      return `${config.uploadsDir}${this.imageUrl}`;
    }

    return null;
  }
}
