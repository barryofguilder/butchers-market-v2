import Ember from 'ember';

export default Ember.Controller.extend({
  eventSort: ['startTime:asc'],
  filteredEvents: Ember.computed.filterBy('model', 'isNew', false),
  sortedEvents: Ember.computed.sort('filteredEvents', 'eventSort'),
  eventToDelete: null,
  showDeleteModal: Ember.computed.notEmpty('eventToDelete'),
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
