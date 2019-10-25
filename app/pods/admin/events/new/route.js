import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.createRecord('event');
  },

  actions: {
    willTransition(/*transition*/) {
      let event = this.modelFor(this.routeName);

      if (event.get('hasDirtyAttributes')) {
        event.rollbackAttributes();
      }

      // Makes sure that the page gets scrolled to the top when changing routes.
      window.scrollTo(0, 0);
    },
  },
});
