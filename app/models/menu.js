import Model, { attr } from '@ember-data/model';
import config from 'butchers-market/config/environment';

export default class Menu extends Model {
  @attr('string') fileUrl;
  @attr('date') updatedAt;

  get fileUrlPath() {
    if (this.fileUrl) {
      return `${config.uploadsDir}${this.fileUrl}`;
    }

    return null;
  }
}
