import Model, { attr } from '@ember-data/model';
import { UPLOADS_DIR } from '../utils/config';

export default class Menu extends Model {
  @attr() declare fileUrl: string;
  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  get fileUrlPath() {
    if (this.fileUrl) {
      return `${UPLOADS_DIR}${this.fileUrl}`;
    }

    return null;
  }
}
