import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AdminEventsIndexController extends Controller {
  queryParams = ['range'];
  @tracked range = 'upcoming';

  @action
  rangeUpdated(range) {
    this.range = range;
  }
}
