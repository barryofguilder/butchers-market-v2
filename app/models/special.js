import Model, { attr } from '@ember-data/model';
import config from 'butchers-market/config/environment';

export default class Special extends Model {
  @attr('string') title;
  @attr('string') imageUrl;
  @attr('string') imageAltText;
  @attr('date') activeStartDate;
  @attr('date') activeEndDate;
  @attr('boolean') isSoldOut;
  @attr('boolean') isHidden;

  get imageUrlPath() {
    if (this.imageUrl) {
      return `${config.uploadsDir}${this.imageUrl}`;
    }

    return null;
  }
}
