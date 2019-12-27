import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdminEventsNewController extends Controller {
  @action
  eventSaved() {
    this.transitionToRoute('admin.events');
  }

  @action
  eventCancelled() {
    this.transitionToRoute('admin.events');
  }
}
