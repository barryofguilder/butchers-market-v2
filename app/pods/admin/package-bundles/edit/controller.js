import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  store: service(),

  actions: {
    bundleSaved() {
      this.transitionToRoute('admin.package-bundles');
    },

    bundleCancelled() {
      this.transitionToRoute('admin.package-bundles');
    },
  },
});
