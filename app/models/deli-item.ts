import Model, { attr } from '@ember-data/model';
import config from 'butchers-market/config/environment';

export default class DeliItem extends Model {
  @attr() declare title: string;
  @attr() declare imageUrl: string;
  @attr() declare ingredients: string;
  @attr() declare isHidden: boolean;
  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  get imageUrlPath() {
    if (this.imageUrl) {
      return `${config.uploadsDir}${this.imageUrl}`;
    }

    return null;
  }
}
