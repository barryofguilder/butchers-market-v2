import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class ReviewsList extends Component {
  @service store;

  @tracked reviews;

  constructor() {
    super(...arguments);

    this.loadReviews.perform();
  }

  @(task(function*() {
    this.reviews = yield this.store.findAll('review');
  }).restartable())
  loadReviews;
}
