import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',
  classNames: ['butcher-promo'],
  attributeBindings: ['ratio:data-stellar-background-ratio', 'verticalOffset:data-stellar-vertical-offset'],

  ratio: '0.5',
  verticalOffset: '-76',

  isDesktop: Ember.computed.bool('media.isDesktop'),
  notDesktop: Ember.computed.not('media.isDesktop')
});
