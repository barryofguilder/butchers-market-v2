import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  store: service(),

  actions: {
    hoursSaved() {
      let hourId = this.get('model.id');
      let hourType = this.get('model.type');
      let hourActive = this.get('model.active');
      let allHours = this.get('store').peekAll('hour');

      allHours.forEach((item) => {
        if (item.get('type') === hourType && item.get('id') !== hourId) {
          item.set('active', !hourActive);
        }
      });

      this.transitionToRoute('admin.hours');
    },

    hoursCancelled() {
      this.transitionToRoute('admin.hours');
    }
  }
});
