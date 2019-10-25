import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  queryParams: {
    events: {
      refreshModel: true,
    },
  },

  model() {
    return RSVP.hash({
      hours: this.store.findAll('hour'),
      events: this.store.findAll('event'),
      performances: this.store.findAll('performance'),
      reviews: this.store.findAll('review'),
    });
  },

  resetController: function(controller, isExiting /*, transition*/) {
    if (isExiting) {
      controller.set('events', false);
    }
  },

  actions: {
    willTransition: function(/*transition*/) {
      this._super(...arguments);

      // Makes sure that the page gets scrolled to the top when changing routes.
      window.scrollTo(0, 0);
    },
  },
});
