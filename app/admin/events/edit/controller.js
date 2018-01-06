import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    eventSaved() {
      this.transitionToRoute('admin.events');
    },

    eventCancelled() {
      this.transitionToRoute('admin.events');
    }
  }
});
