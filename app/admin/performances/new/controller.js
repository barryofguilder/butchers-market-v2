import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    performanceSaved() {
      this.transitionToRoute('admin.performances');
    },

    performanceCancelled() {
      this.transitionToRoute('admin.performances');
    }
  }
});
