import Model, { attr } from '@warp-drive/legacy/model';
import { UPLOADS_DIR } from '../utils/config';

export default class GrabAndGo extends Model {
  @attr() declare title: string;
  @attr() declare socialTitle: string | null;
  @attr() declare imageUrl: string | null;
  @attr() declare description: string;
  @attr('boolean', { defaultValue: false }) declare inStock: boolean;
  @attr() declare isHoliday: boolean;
  @attr('date') declare createdAt: Date;
  @attr('date') declare updatedAt: Date;

  get imageUrlPath() {
    if (this.imageUrl) {
      return `${UPLOADS_DIR}${this.imageUrl}`;
    }

    return null;
  }
}
