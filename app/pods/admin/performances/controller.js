import Controller from '@ember/controller';
import { sort, notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
import { task } from 'ember-concurrency';

export default Controller.extend({
  // Using `model.@each.id` instead of `model.[]` because this wasn't getting refreshed after
  // adding a new record.
  filteredPerformances: computed('model.@each.id', function() {
    return this.model.filter(item => !item.get('isNew'));
  }),
  currentSort: null,
  performancesSort: computed('currentSort.{sortColumn,sortDirection}', function() {
    let sortColumn = this.get('currentSort.sortColumn');
    let sortDirection = this.get('currentSort.sortDirection');

    if (isBlank(sortColumn)) {
      return ['title:asc'];
    }

    return [`${sortColumn}:${sortDirection}`];
  }),
  sortedPerformances: sort('filteredPerformances', 'performancesSort'),

  performanceToDelete: null,
  showDeleteModal: notEmpty('performanceToDelete'),
  errorMessage: null,
  deleteDisabled: computed('deletePerformance.isRunning', function() {
    return this.get('deletePerformance.isRunning');
  }),

  deletePerformance: task(function*() {
    let performance = this.get('performanceToDelete');

    try {
      yield performance.destroyRecord();
      this.set('performanceToDelete', null);
    } catch (reason) {
      this.get('performanceToDelete').rollbackAttributes();
      this.set('errorMessage', reason);
    }
  }).drop(),

  actions: {
    sortPerformances(sort) {
      this.set('currentSort', sort);
    },

    delete(performance) {
      this.setProperties({
        performanceToDelete: performance,
        errorMessage: null,
      });
    },

    cancelDelete() {
      this.set('performanceToDelete', null);
    },
  },
});
