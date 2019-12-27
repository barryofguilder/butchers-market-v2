import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class ContactController extends Controller {
  queryParams = ['events'];

  @tracked events = false;

  get isEventsPage() {
    return this.events;
  }
}
