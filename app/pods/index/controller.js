import { filterBy } from '@ember/object/computed';
import Controller from '@ember/controller';
import MediaMixin from 'butchers-market/mixins/media-mixin';
import { computed } from '@ember/object';
import { isAfter, isBefore, addDays } from 'date-fns';
import { inject as service } from '@ember/service';

export default Controller.extend(MediaMixin, {
  media: service(),

  featuredBundles: filterBy('model.bundles', 'featured', true),

  tacoSeasonDate: null,
  showTacoSeason: computed('tacoSeasonDate', function() {
    let takedownDate = addDays(this.tacoSeasonDate, 7);

    return isBefore(new Date(), takedownDate);
  }),
  tacoSeasonArrived: computed('tacoSeasonDate', function() {
    return isAfter(new Date(), this.tacoSeasonDate);
  }),
  tacoSeasonClass: computed('showTacoSeason', function() {
    return this.showTacoSeason ? 'taco-season' : null;
  }),

  init() {
    this._super(...arguments);

    // March 20, 2018 9:00am
    this.set('tacoSeasonDate', new Date(2018, 2, 20, 10, 0));
  },
});
