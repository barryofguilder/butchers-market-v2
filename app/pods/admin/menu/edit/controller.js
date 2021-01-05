import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdminMenuEditController extends Controller {
  @action
  menuSaved() {
    this.transitionToRoute('admin.menu');
  }

  @action
  menuCancelled() {
    this.transitionToRoute('admin.menu');
  }
}
