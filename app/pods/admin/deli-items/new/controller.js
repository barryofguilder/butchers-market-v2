import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdminDeliItemsNewController extends Controller {
  @action
  deliItemSaved() {
    this.transitionToRoute('admin.deli-items');
  }

  @action
  deliItemCancelled() {
    this.transitionToRoute('admin.deli-items');
  }
}
