import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import dateSort from 'butchers-market/utils/date-sort';

export default Controller.extend({
  // Using `model.@each.id` instead of `model.[]` because this wasn't getting refreshed after
  // adding a new record.
  filteredEvents: computed('model.@each.id', 'filter', function() {
    let now = new Date();

    return this.model.filter(item => {
      if (item.get('isNew')) {
        return false;
      }

      if (isBlank(this.filter)) {
        return true;
      }

      let startTime = item.get('startTime');

      return this.filter === 'upcoming'
        ? isSameDay(startTime, now) || isAfter(startTime, now)
        : isBefore(startTime, now);
    });
  }),
  sortedEvents: sort('filteredEvents', dateSort),

  filter: 'upcoming',
  upcomingClass: computed('filter', function() {
    return this.filter === 'upcoming' ? 'active' : null;
  }),
  pastClass: computed('filter', function() {
    return this.filter === 'past' ? 'active' : null;
  }),
  allClass: computed('filter', function() {
    return isBlank(this.filter) ? 'active' : null;
  }),

  actions: {
    filterEvents(filter) {
      this.set('filter', filter);
    },
  },
});
