import Controller from '@ember/controller';

export default Controller.extend({
  errorMessage: null,

  actions: {
    deleteEvent() {
      this.model.destroyRecord().then(() => {
        this.transitionToRoute('admin.events');
      }).catch((reason) => {
        this.set('errorMessage', reason);
      });
    },

    cancelDelete() {
      this.transitionToRoute('admin.events');
    }
  }
});
