import Controller from '@ember/controller';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';

export default class AdminGrabAndGoNewController extends Controller {
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
