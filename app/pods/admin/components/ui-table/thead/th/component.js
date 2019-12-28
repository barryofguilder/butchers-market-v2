import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { equal } from '@ember/object/computed';

export default class UiTableTheadTh extends Component {
  @tracked sortDirection;

  get sortColumn() {
    return this.sortDirection ? this.args.name : null;
  }

  @equal('sortDirection', 'asc')
  isAscending;

  @equal('sortDirection', 'desc')
  isDescending;

  @action
  columnClicked() {
    if (this.isAscending) {
      this.sortDirection = 'desc';
    } else if (this.isDescending) {
      this.sortDirection = null;
    } else {
      this.sortDirection = 'asc';
    }

    if (this.args.onColumnClicked) {
      this.args.onColumnClicked({
        sortColumn: this.sortColumn,
        sortDirection: this.sortDirection,
      });
    }
  }

  @action
  setSortDirection() {
    if (this.args.currentSort && this.args.currentSort.sortColumn === this.args.name) {
      this.sortDirection = this.args.currentSort.sortDirection;
    } else {
      this.sortDirection = null;
    }
  }
}
