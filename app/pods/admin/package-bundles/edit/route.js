import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('package-bundle', params.id);
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
