import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AdminEventsIndexController extends Controller {
  queryParams = ['page', 'range'];
  @tracked page = 1;
  @tracked range = 'upcoming';

  get pageMeta() {
    return this.model.meta.page;
  }

  @action
  rangeUpdated(range) {
    this.range = range;
    this.page = 1;
  }

  @action
  pageChanged(page) {
    this.page = page;
  }
}
