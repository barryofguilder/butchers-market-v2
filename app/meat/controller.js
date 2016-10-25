import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['packages'],
  packages: false,

  cardColumns: Ember.computed('media.isMobile', function() {
    return this.get('media.isMobile') ? 2 : 3;
  })
});
