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
    }
  }
});
