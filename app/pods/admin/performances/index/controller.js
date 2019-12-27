import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { sort } from '@ember/object/computed';
import { isBlank } from '@ember/utils';

export default class AdminPerformancesIndexController extends Controller {
  @tracked currentSort = {};

  get performancesSort() {
    let sortColumn = this.currentSort.sortColumn;
    let sortDirection = this.currentSort.sortDirection;

    if (isBlank(sortColumn)) {
      return ['title:asc'];
    }

    return [`${sortColumn}:${sortDirection}`];
  }

  @sort('model', 'performancesSort')
  sortedPerformances;

  @action
  sortPerformances(sort) {
    this.currentSort = sort;
  }
}
