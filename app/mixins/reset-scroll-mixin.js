import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    willTransition: function(transition) {
      this._super(...arguments);

      window.scrollTo(0, 0);
    }
  }
});
