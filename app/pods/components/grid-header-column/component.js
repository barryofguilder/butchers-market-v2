import { or, equal } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'th',

  name: null,
  currentSort: null,
  onColumnClicked: null,

  sortColumn: computed('sortDirection', function() {
    if (isEmpty(this.get('sortDirection'))) {
      return null;
    }

    return this.get('name');
  }),
  sortDirection: null,
  isSorted: or('isAscending', 'isDescending'),
  isAscending: equal('sortDirection', 'asc'),
  isDescending: equal('sortDirection', 'desc'),

  didReceiveAttrs() {
    this._super(...arguments);

    let currentSort = this.get('currentSort');

    if (isEmpty(currentSort)) {
      return;
    }

    if (currentSort.sortColumn === this.get('name')) {
      this.set('sortDirection', currentSort.sortDirection);
    } else {
      this.set('sortDirection', null);
    }
  },

  actions: {
    columnClicked() {
      if (this.get('isAscending')) {
        this.set('sortDirection', 'desc');
      } else if (this.get('isDescending')) {
        this.set('sortDirection', null);
      } else {
        this.set('sortDirection', 'asc');
      }

      let data = this.getProperties('sortColumn', 'sortDirection');

      let onColumnClicked = this.get('onColumnClicked');
      onColumnClicked(data);
    },
  },
});
