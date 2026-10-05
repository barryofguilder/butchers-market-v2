import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

export default class AdminMenuEditController extends Controller {
  @service declare router: RouterService;

  @action
  menuSaved() {
    this.router.transitionTo('admin.menu');
  }

  @action
  menuCancelled() {
    this.router.transitionTo('admin.menu');
  }
}
