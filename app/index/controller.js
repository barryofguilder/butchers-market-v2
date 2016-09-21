import Ember from 'ember';

export default Ember.Controller.extend({
  isDesktop: Ember.computed.bool('media.isDesktop'),
  notDesktop: Ember.computed.not('media.isDesktop'),
  featuredBundles: Ember.computed.filterBy('model.bundles', 'featured', true)
});
