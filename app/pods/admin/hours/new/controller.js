import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  store: service(),

  actions: {
    hoursSaved() {
      this.transitionToRoute('admin.hours');
    },

    hoursCancelled() {
      this.transitionToRoute('admin.hours');
    }
  }
});
