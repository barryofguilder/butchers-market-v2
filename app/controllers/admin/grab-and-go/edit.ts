import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

export default class AdminGrabAndGoEditController extends Controller {
  @service declare router: RouterService;

  @action
  itemSaved() {
    this.router.transitionTo('admin.grab-and-go');
  }

  @action
  itemCancelled() {
    this.router.transitionTo('admin.grab-and-go');
  }
}
