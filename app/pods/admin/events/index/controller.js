import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import dateSort from 'butchers-market/utils/date-sort';

export default Controller.extend({
  filter: 'upcoming',

  filteredEvents: computed('model.[]', 'filter', function() {
    let now = new Date();

    return this.model.filter(item => {
      if (this.filter === 'all') {
        return true;
      }

      let startTime = item.get('startTime');

      return this.filter === 'upcoming'
        ? isSameDay(startTime, now) || isAfter(startTime, now)
        : isBefore(startTime, now);
    });
  }),
  sortedEvents: sort('filteredEvents', dateSort),

  actions: {
    filterEvents(filter) {
      this.set('filter', filter);
    },
  },
});
