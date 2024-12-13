import Model, { attr } from '@ember-data/model';
import config from 'butchers-market/config/environment';

export default class Menu extends Model {
  @attr() declare fileUrl: string;
  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  get fileUrlPath() {
    if (this.fileUrl) {
      return `${config.uploadsDir}${this.fileUrl}`;
    }

    return null;
  }
}
