import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.createRecord('hour');
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
