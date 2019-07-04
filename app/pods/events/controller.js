import Controller from '@ember/controller';
import MediaMixin from 'butchers-market/mixins/media-mixin';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import dateSort from 'butchers-market/utils/date-sort';
import { isAfter, isSameDay } from 'date-fns';
import { inject as service } from '@ember/service';

const PERFORMANCES_TO_SHOW = 11;

export default Controller.extend(MediaMixin, {
  media: service(),

  queryParams: ['events'],
  events: false,

  filteredEvents: computed('model.events.[]', function() {
    let now = new Date();

    return this.model.events.filter(event => {
      let date = event.get('startTime');
      // Only return events that are today or in the future.
      return isSameDay(date, now) || isAfter(date, now);
    });
  }),
  sortedEvents: sort('filteredEvents', dateSort),

  filteredPerformances: computed('model.performances', function() {
    let performances = this.get('model.performances');
    let performanceCount = performances.get('length');
    let randomPerformances = [];

    while (randomPerformances.get('length') < performanceCount) {
      let performance = performances.objectAt(Math.floor(Math.random() * performanceCount));

      let found = randomPerformances.findBy('id', performance.get('id'));

      if (found) {
        continue;
      }

      randomPerformances.pushObject(performance);
    }

    return randomPerformances.slice(0, PERFORMANCES_TO_SHOW);
  }),
});
