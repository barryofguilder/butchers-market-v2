import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AdminGrabAndGoEditController extends Controller {
  @service router;

  @action
  itemSaved() {
    this.router.transitionTo('admin.grab-and-go');
  }

  @action
  itemCancelled() {
    this.router.transitionTo('admin.grab-and-go');
  }
}
