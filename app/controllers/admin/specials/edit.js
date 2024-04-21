import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AdminSpecialsEditController extends Controller {
  @service router;

  @action
  specialSaved() {
    this.router.transitionTo('admin.specials');
  }

  @action
  specialCancelled() {
    this.router.transitionTo('admin.specials');
  }
}
