import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';

const DEFAULT_COLUMN_OUTPUT = {
  sortColumn: null,
  sortDirection: null,
};

export default class UiTableTheadThComponent extends Component {
  @tracked sortDirection;

  get sortColumn() {
    return this.sortDirection ? this.args.name : null;
  }

  get isAscending() {
    return this.sortDirection === 'asc';
  }

  get isDescending() {
    return this.sortDirection === 'desc';
  }

  initColumn = modifier(() => {
    const { currentSort, name } = this.args;
    const { sortColumn, sortDirection } = currentSort ?? DEFAULT_COLUMN_OUTPUT;

    this.sortDirection = sortColumn === name ? sortDirection : null;
  });

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
}
