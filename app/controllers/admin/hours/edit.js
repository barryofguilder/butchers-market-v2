import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class AdminHoursEditController extends Controller {
  @service router;

  @action
  hoursSaved() {
    this.router.transitionTo('admin.hours');
  }

  @action
  hoursCancelled() {
    this.router.transitionTo('admin.hours');
  }
}
