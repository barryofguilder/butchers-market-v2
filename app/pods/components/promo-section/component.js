import Component from '@ember/component';

export default Component.extend({
  tagName: 'section',
  classNames: ['butcher-promo'],
  classNameBindings: ['specialHours:special-hours', 'darken:darken'],

  specialHours: false,
  darken: false,
});
