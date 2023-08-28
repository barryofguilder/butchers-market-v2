import Model, { attr } from '@ember-data/model';
import config from 'butchers-market/config/environment';

export default class PackageBundle extends Model {
  @attr() declare displayOrder: number;
  @attr() declare title: string;
  @attr() declare fileUrl: string;
  @attr() declare specialText: string;
  @attr() declare prices: string[];
  @attr() declare items: string[];

  get fileUrlPath() {
    if (this.fileUrl) {
      return `${config.uploadsDir}${this.fileUrl}`;
    }

    return null;
  }
}
