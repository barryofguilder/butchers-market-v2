import Model, { attr } from '@ember-data/model';
import config from 'butchers-market/config/environment';

export default class Special extends Model {
  @attr() declare title: string;
  @attr() declare link: string;
  @attr() declare displayOrder: number;
  @attr() declare imageUrl: string;
  @attr() declare imageAltText: string;
  @attr('date') declare activeStartDate: Date;
  @attr('date') declare activeEndDate: Date;
  @attr() declare isSoldOut: boolean;
  @attr() declare isHidden: boolean;

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
