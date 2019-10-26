import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      hours: this.store.findAll('hour'),
      bundles: this.store.findAll('meat-bundle'),
      products: this.store.findAll('meat-product'),
      reviews: this.store.findAll('review'),
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
