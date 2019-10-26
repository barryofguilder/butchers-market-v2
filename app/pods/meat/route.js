import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      bundles: this.store.findAll('meat-bundle'),
      products: this.store.findAll('meat-product'),
      packageBundles: this.store.findAll('package-bundle'),
    });
  },

  actions: {
    willTransition: function(/*transition*/) {
      this._super(...arguments);

      // Makes sure that the page gets scrolled to the top when changing routes.
      window.scrollTo(0, 0);
    },
  },
});
