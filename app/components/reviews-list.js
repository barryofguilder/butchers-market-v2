import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { restartableTask } from 'ember-concurrency';

export default class ReviewsListComponent extends Component {
  @service store;

  @tracked reviews;

  constructor() {
    super(...arguments);

    this.loadReviews.perform();
  }

  loadReviews = restartableTask(async () => {
    this.reviews = await this.store.findAll('review');
  });
}
