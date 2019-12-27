import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AdminHoursNewController extends Controller {
  @service store;

  @action
  hoursSaved() {
    this.transitionToRoute('admin.hours');
  }

  @action
  hoursCancelled() {
    this.transitionToRoute('admin.hours');
  }
}
