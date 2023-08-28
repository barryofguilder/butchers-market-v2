import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency';
import Store from '@ember-data/store';
import ReviewModel from 'butchers-market/models/review';
import { EmptyObject } from '@ember/component/helper';

export interface ReviewsListSignature {
  Args: EmptyObject;
}

export default class ReviewsListComponent extends Component<ReviewsListSignature> {
  @service declare store: Store;

  @tracked reviews: ReviewModel[] = [];

  constructor(owner: unknown, args: ReviewsListSignature['Args']) {
    super(owner, args);

    this.loadReviews.perform();
  }

  loadReviews = restartableTask(async () => {
    const reviews = await this.store.findAll('review');
    this.reviews = reviews.slice();
  });
}
