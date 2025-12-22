import Model, { attr } from '@ember-data/model';
import { ORDER_ONLINE_URL, UPLOADS_DIR } from '../utils/config';

export default class Special extends Model {
  @attr() declare title: string;
  @attr() declare link: string;
  @attr() declare displayOrder: number;
  @attr() declare imageUrl: string;
  @attr() declare imageAltText: string;
  @attr('date') declare activeStartDate: Date;
  @attr('date') declare activeEndDate: Date;
  @attr('boolean', { defaultValue: false }) declare inStock: boolean;
  @attr() declare isHidden: boolean;
  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  get renderLink() {
    return this.link || ORDER_ONLINE_URL;
  }

  get imageUrlPath() {
    if (this.imageUrl) {
      return `${UPLOADS_DIR}${this.imageUrl}`;
    }

    return null;
  }
}
