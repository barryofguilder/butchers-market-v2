import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['iphone-carousel'],
  
  didInsertElement() {
    Ember.$('.fotorama').fotorama();
  }
});
