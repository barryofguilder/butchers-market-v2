import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement() {
    Ember.$(window).stellar({
      horizontalScrolling: false
    });
  }
});
