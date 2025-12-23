import Model, { attr } from '@ember-data/model';
import { UPLOADS_DIR } from '../utils/config';

export default class PackageBundle extends Model {
  @attr() declare displayOrder: number;
  @attr() declare title: string;
  @attr() declare fileUrl: string;
  @attr() declare specialText: string;
  @attr() declare prices: string[];
  @attr() declare items: string[];
  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  get fileUrlPath() {
    if (this.fileUrl) {
      return `${UPLOADS_DIR}${this.fileUrl}`;
    }

    return null;
  }
}
