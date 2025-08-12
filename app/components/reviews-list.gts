import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import { restartableTask } from 'ember-concurrency';
import type Review from '../models/review';

export default class ReviewsListComponent extends Component {
  @service declare store: Store;

  @tracked reviews: Review[] = [];

  constructor(owner: unknown, args: object) {
    super(owner, args);

    this.loadReviews.perform();
  }

  loadReviews = restartableTask(async () => {
    const reviews = await this.store.findAll('review');
    this.reviews = reviews.slice();
  });

  <template>
    {{#unless this.loadReviews.isRunning}}
      {{#each this.reviews as |review|}}
        <div class='sm:mt-8 mt-12 max-w-2xl mx-auto flex flex-col sm:flex-row items-center'>
          <div>
            <img
              class='rounded-full w-16 sm:w-20 shadow-md'
              src={{review.imageUrl}}
              alt='Reviewer avatar'
            />
          </div>
          <div class='mt-2 text-center sm:mt-0 sm:ml-6 sm:text-left'>
            <p class='text-lg sm:text-xl'>&ldquo;{{review.text}}&rdquo;</p>
            <p class='text-sm sm:text-base'>
              <span class='text-gray-700'>{{review.reviewer}},</span>
              <br class='sm:hidden' />
              <a class='text-red-800' href={{review.url}} target='_blank' rel='noopener noreferrer'>
                {{review.source}}
              </a>
            </p>
          </div>
        </div>
      {{/each}}
    {{/unless}}
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ReviewsList: typeof ReviewsListComponent;
  }
}
