import Ember from 'ember';

export default Ember.Mixin.create({
  actions: {
    willTransition: function(transition) {
      this._super(...arguments);

      if (Ember.$(document).scrollTop() > position) {
        window.scrollTo(0, 0);
      }
    }
  }
});
