import { filterBy } from '@ember/object/computed';
import Controller from '@ember/controller';
import MediaMixin from 'butchers-market/mixins/media-mixin';
import { computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend(MediaMixin, {
  featuredBundles: filterBy('model.bundles', 'featured', true),

  tacoSeasonDate: null,
  showTacoSeason: computed('tacoSeasonDate', function() {
    let takedownDate = moment(this.get('tacoSeasonDate')).add(7, 'days');
    let now = moment();

    return now.isBefore(takedownDate);
  }),
  tacoSeasonArrived: computed('tacoSeasonDate', function() {
    let now = moment();

    return now.isAfter(this.get('tacoSeasonDate'), 'second');
  }),
  tacoSeasonClass: computed('showTacoSeason', function() {
    return this.get('showTacoSeason') ? 'taco-season' : null;
  }),

  carouselPhotos: Object.freeze([
    {
      url: 'images/iPhone-loyalty-club-1.jpg',
      description: 'Loyalty Club punch card'
    },
    {
      url: 'images/iPhone-loyalty-club-2.jpg',
      description: 'Loyalty Club discount'
    },
    {
      url: 'images/iPhone-mobile-app.jpg',
      description: 'Butchers Market mobile app'
    }
  ]),

  init() {
    this._super(...arguments);

    // March 20, 2018 9:00am
    this.set('tacoSeasonDate', new Date(2018, 2, 20, 10, 0));
  }
});
