import { filterBy, sort, notEmpty } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  eventSort: ['startTime:asc'],
  filteredEvents: filterBy('model', 'isNew', false),
  sortedEvents: sort('filteredEvents', 'eventSort'),
  eventToDelete: null,
  showDeleteModal: notEmpty('eventToDelete'),
  errorMessage: null,

  actions: {
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
