import Controller from '@ember/controller';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';

export default class AdminHoursEditController extends Controller {
  @service declare router: RouterService;

  @action
  hoursSaved() {
    this.router.transitionTo('admin.hours');
  }

  @action
  hoursCancelled() {
    this.router.transitionTo('admin.hours');
  }
}
