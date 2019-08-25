import Component from '@ember/component';
import layout from './template';
import { equal } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Component.extend({
  layout,

  tagName: '',

  name: null,
  currentSort: null,
  onColumnClicked() {},

  sortDirection: null,
  sortColumn: computed('sortDirection', function() {
    return this.sortDirection ? this.name : null;
  }),
  isAscending: equal('sortDirection', 'asc'),
  isDescending: equal('sortDirection', 'desc'),

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.currentSort && this.currentSort.sortColumn === this.name) {
      this.set('sortDirection', this.currentSort.sortDirection);
    } else {
      this.set('sortDirection', null);
    }
  },

  actions: {
    columnClicked() {
      if (this.isAscending) {
        this.set('sortDirection', 'desc');
      } else if (this.isDescending) {
        this.set('sortDirection', null);
      } else {
        this.set('sortDirection', 'asc');
      }

      this.onColumnClicked({
        sortColumn: this.sortColumn,
        sortDirection: this.sortDirection,
      });
    },
  },
});
