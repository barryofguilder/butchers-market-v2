import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    events: {
      refreshModel: true,
    },
  },

  actions: {
    willTransition: function(/*transition*/) {
      this._super(...arguments);

      // Makes sure that the page gets scrolled to the top when changing routes.
      window.scrollTo(0, 0);
    },
  },
});
