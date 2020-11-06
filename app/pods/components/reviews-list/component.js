import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency-decorators';

export default class ReviewsList extends Component {
  @service store;

  @tracked reviews;

  constructor() {
    super(...arguments);

    this.loadReviews.perform();
  }

  @restartableTask
  *loadReviews() {
    this.reviews = yield this.store.findAll('review');
  }
}
