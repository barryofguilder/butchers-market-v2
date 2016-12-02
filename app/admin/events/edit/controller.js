import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    eventSaved() {
      this.transitionToRoute('admin.events');
    },

    eventCancelled() {
      this.transitionToRoute('admin.events');
    }
  }
});
