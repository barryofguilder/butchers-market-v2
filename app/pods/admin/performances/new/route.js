import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.createRecord('performance');
  },

  actions: {
    willTransition(/*transition*/) {
      let performance = this.modelFor(this.routeName);

      if (performance.get('hasDirtyAttributes')) {
        performance.rollbackAttributes();
      }

      // Makes sure that the page gets scrolled to the top when changing routes.
      window.scrollTo(0, 0);
    },
  },
});
