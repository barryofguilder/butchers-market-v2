import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AdminDeliItemsEditController extends Controller {
  @service router;

  @action
  deliItemSaved() {
    this.router.transitionTo('admin.deli-items');
  }

  @action
  deliItemCancelled() {
    this.router.transitionTo('admin.deli-items');
  }
}
