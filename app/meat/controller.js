import Ember from 'ember';

export default Ember.Controller.extend({
  bundleColumns: Ember.computed('media.isMobile', function() {
    return this.get('media.isMobile') ? 2 : 3;
  })
});
