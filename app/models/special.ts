import Model, { attr } from '@ember-data/model';
import config from 'butchers-market/config/environment';

export default class Special extends Model {
  @attr('string') declare title: string;
  @attr('string') declare link: string;
  @attr('number') declare displayOrder: number;
  @attr('string') declare imageUrl: string;
  @attr('string') declare imageAltText: string;
  @attr('date') declare activeStartDate: Date;
  @attr('date') declare activeEndDate: Date;
  @attr('boolean') declare isSoldOut: boolean;
  @attr('boolean') declare isHidden: boolean;

  get renderLink() {
    return this.link || config.orderOnlineUrl;
  }

  get imageUrlPath() {
    if (this.imageUrl) {
      return `${config.uploadsDir}${this.imageUrl}`;
    }

    return null;
  }
}
