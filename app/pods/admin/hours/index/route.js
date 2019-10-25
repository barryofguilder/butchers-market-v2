import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll('hour');
  },

  actions: {
    willTransition: function(/*transition*/) {
      this._super(...arguments);

      // Makes sure that the page gets scrolled to the top when changing routes.
      window.scrollTo(0, 0);
    },
  },
});
