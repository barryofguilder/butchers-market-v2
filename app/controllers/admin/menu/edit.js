import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AdminMenuEditController extends Controller {
  @service router;

  @action
  menuSaved() {
    this.router.transitionTo('admin.menu');
  }

  @action
  menuCancelled() {
    this.router.transitionTo('admin.menu');
  }
}
