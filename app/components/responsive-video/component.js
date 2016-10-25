import Ember from 'ember';

export default Ember.Component.extend({
  url: null,

  didInsertElement() {
    this._super(...arguments);
    //Ember.$('.responsive-video').fitVids();
  }
});
