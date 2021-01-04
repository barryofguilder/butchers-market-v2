import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdminSpecialsEditController extends Controller {
  @action
  specialSaved() {
    this.transitionToRoute('admin.specials');
  }

  @action
  specialCancelled() {
    this.transitionToRoute('admin.specials');
  }
}
