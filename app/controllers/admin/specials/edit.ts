import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

export default class AdminSpecialsEditController extends Controller {
  @service declare router: RouterService;

  @action
  specialSaved() {
    this.router.transitionTo('admin.specials');
  }

  @action
  specialCancelled() {
    this.router.transitionTo('admin.specials');
  }
}
