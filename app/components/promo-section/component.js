import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['butcher-promo'],
  classNameBindings: ['specialHours:special-hours'],

  specialHours: false,
  darken: false
});
