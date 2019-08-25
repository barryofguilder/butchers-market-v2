import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';

export default Controller.extend({
  currentSort: null,
  performancesSort: computed('currentSort.{sortColumn,sortDirection}', function() {
    let sortColumn = this.get('currentSort.sortColumn');
    let sortDirection = this.get('currentSort.sortDirection');

    if (isBlank(sortColumn)) {
      return ['title:asc'];
    }

    return [`${sortColumn}:${sortDirection}`];
  }),
  sortedPerformances: sort('model', 'performancesSort'),

  actions: {
    sortPerformances(sort) {
      this.set('currentSort', sort);
    },
  },
});
