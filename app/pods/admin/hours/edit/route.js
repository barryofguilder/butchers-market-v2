import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('hour', params.id);
  },

  actions: {
    willTransition(/*transition*/) {
      let hour = this.modelFor(this.routeName);

      if (hour.get('hasDirtyAttributes')) {
        hour.rollbackAttributes();
      }

      // Makes sure that the page gets scrolled to the top when changing routes.
      window.scrollTo(0, 0);
    },
  },
});
