import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

export default class AdminDeliItemsNewController extends Controller {
  @service declare router: RouterService;

  @action
  deliItemSaved() {
    this.router.transitionTo('admin.deli-items');
  }

  @action
  deliItemCancelled() {
    this.router.transitionTo('admin.deli-items');
  }
}
