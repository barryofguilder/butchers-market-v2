import Ember from 'ember';

export default Ember.Controller.extend({
  beers: Ember.computed.filterBy('model.items', 'category', 1),
  wines: Ember.computed.filterBy('model.items', 'category', 2),
  nonAlcohols: Ember.computed.filterBy('model.items', 'category', 3),
  cardColumns: Ember.computed('media.isMobile', function() {
    return this.get('media.isMobile') ? 2 : 4;
  })
});
