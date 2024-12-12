import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class AdminSpecialsNewController extends Controller {
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
