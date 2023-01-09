import Model, { attr } from '@ember-data/model';
import config from 'butchers-market/config/environment';

export default class PackageBundle extends Model {
  @attr('number') displayOrder;
  @attr('string') title;
  @attr('string') fileUrl;
  @attr('string') specialText;
  @attr prices; // Array of strings
  @attr items; // Array of strings

  get fileUrlPath() {
    if (this.fileUrl) {
      return `${config.uploadsDir}${this.fileUrl}`;
    }

    return null;
  }
}
