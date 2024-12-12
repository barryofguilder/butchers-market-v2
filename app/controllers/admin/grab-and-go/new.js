import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class AdminGrabAndGoNewController extends Controller {
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
