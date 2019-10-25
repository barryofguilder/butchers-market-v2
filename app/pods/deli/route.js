import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      items: this.store.findAll('deli-item'),
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
