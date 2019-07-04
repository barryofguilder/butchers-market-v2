import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('performance', params.id);
  },

  actions: {
    willTransition(/*transition*/) {
      let performance = this.modelFor(this.routeName);

      if (performance.get('hasDirtyAttributes')) {
        performance.rollbackAttributes();
      }
    },
  },
});
