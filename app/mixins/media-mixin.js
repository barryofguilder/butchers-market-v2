import Ember from 'ember';

export default Ember.Mixin.create({
  isDesktop: Ember.computed.bool('media.isDesktop'),
  notDesktop: Ember.computed.not('media.isDesktop')
});
