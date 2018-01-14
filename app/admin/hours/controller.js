import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Controller.extend({
  hoursSort: computed(function() {
    return ['type:asc', 'label:asc'];
  }),
  sortedHours: sort('model', 'hoursSort')
});
