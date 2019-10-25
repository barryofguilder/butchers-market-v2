import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.createRecord('package-bundle', { prices: [], items: [] });
  },

  actions: {
    willTransition(/*transition*/) {
      let packageBundle = this.modelFor(this.routeName);

      if (packageBundle.get('hasDirtyAttributes')) {
        packageBundle.rollbackAttributes();
      }
    },
  },
});
