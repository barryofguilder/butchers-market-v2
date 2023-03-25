import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { sort } from '@ember/object/computed';
import { isBlank } from '@ember/utils';

export default class AdminDeliItemsIndexController extends Controller {
  @tracked currentSort = {};
  @tracked itemToDelete = null;
  @tracked deleteModalOpen = false;

  get deliItemsSort() {
    let sortColumn = this.currentSort.sortColumn;
    let sortDirection = this.currentSort.sortDirection;

    if (isBlank(sortColumn)) {
      return ['title:asc'];
    }

    return [`${sortColumn}:${sortDirection}`];
  }

  @sort('model', 'deliItemsSort')
  sortedDeliItems;

  @action
  sortDeliItems(sort) {
    this.currentSort = sort;
  }

  @action
  openDeleteModal(item) {
    this.itemToDelete = item;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
