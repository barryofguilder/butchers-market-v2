import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AdminSpecialsEditController extends Controller {
  @service store;

  @action
  specialSaved() {
    this.transitionToRoute('admin.specials');
  }

  @action
  specialCancelled() {
    this.transitionToRoute('admin.specials');
  }
}
