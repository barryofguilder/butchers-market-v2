import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class DeliController extends Controller {
  @service media;

  get cardColumns() {
    return this.media.isMd ? 2 : 4;
  }
}
