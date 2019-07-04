import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('event', params.id);
  },

  actions: {
    willTransition(/*transition*/) {
      let event = this.modelFor(this.routeName);

      if (event.get('hasDirtyAttributes')) {
        event.rollbackAttributes();
      }
    },
  },
});
