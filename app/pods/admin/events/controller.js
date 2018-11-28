import { sort, notEmpty } from '@ember/object/computed';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { isAfter, isBefore, isSameDay } from 'date-fns';

export default Controller.extend({
  // Using `model.@each.id` instead of `model.[]` because this wasn't getting refreshed after
  // adding a new record.
  filteredEvents: computed('model.@each.id', 'filter', function() {
    let now = new Date();

    return this.model.filter((item) => {
      if (item.get('isNew')) {
        return false;
      }

      if (isBlank(this.filter)) {
        return true;
      }

      let startTime = item.get('startTime');

      return this.filter === 'upcoming'
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
    return this.filter === 'past' ? 'active': null;
  }),
  upcomingClass: computed('filter', function() {
    return this.filter === 'upcoming' ? 'active': null;
  }),
  allClass: computed('filter', function() {
    return isBlank(this.filter) ? 'active': null;
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
      this.eventToDelete.destroyRecord().then(() => {
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
