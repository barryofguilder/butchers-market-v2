import { sort, notEmpty } from '@ember/object/computed';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { isAfter, isBefore, isSameDay } from 'date-fns';

export default Controller.extend({
  filteredEvents: computed('model.[]', 'filter', function() {
    let filter = this.get('filter');
    let now = new Date();

    return this.get('model').filter((item) => {
      if (item.get('isNew')) {
        return false;
      }

      if (isBlank(filter)) {
        return true;
      }

      let startTime = item.get('startTime');

      return filter === 'upcoming'
        ? (isSameDay(startTime, now) || isAfter(startTime, now))
        : isBefore(startTime, now);
    });
  }),
  currentSort: null,
  eventsSort: computed('currentSort.{sortColumn,sortDirection}', function() {
    let sortColumn = this.get('currentSort.sortColumn');
    let sortDirection = this.get('currentSort.sortDirection');

    if (isBlank(sortColumn)) {
      return ['startTime:asc'];
    }

    return [`${sortColumn}:${sortDirection}`];
  }),
  sortedEvents: sort('filteredEvents', 'eventsSort'),
  eventToDelete: null,
  showDeleteModal: notEmpty('eventToDelete'),
  errorMessage: null,

  filter: null,
  pastClass: computed('filter', function() {
    return this.get('filter') === 'past' ? 'active': null;
  }),
  upcomingClass: computed('filter', function() {
    return this.get('filter') === 'upcoming' ? 'active': null;
  }),
  allClass: computed('filter', function() {
    return isBlank(this.get('filter')) ? 'active': null;
  }),

  actions: {
    filterEvents(filter) {
      this.set('filter', filter);
    },

    sortEvents(sort) {
      this.set('currentSort', sort);
    },

    delete(event) {
      this.set('eventToDelete', event);
    },

    deleteEvent() {
      let event = this.get('eventToDelete');

      event.destroyRecord().then(() => {
        this.set('eventToDelete', null);
      }).catch((reason) => {
        this.set('errorMessage', reason);
      });
    },

    cancelDelete() {
      this.set('eventToDelete', null);
    }
  }
});
