import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AdminDeliItemsNewController extends Controller {
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
