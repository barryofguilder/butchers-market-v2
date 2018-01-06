import { computed } from '@ember/object';
import { filterBy } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  beers: filterBy('model.items', 'category', 1),
  wines: filterBy('model.items', 'category', 2),
  nonAlcohols: filterBy('model.items', 'category', 3),
  cardColumns: computed('media.isMobile', function() {
    return this.get('media.isMobile') ? 2 : 4;
  })
});
