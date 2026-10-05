import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { sort } from '@ember/object/computed';
import { isBlank } from '@ember/utils';
import type { ColumnOutput } from '../../../components/admin/ui-table';
import type DeliItem from '../../../models/deli-item';

export default class AdminDeliItemsIndexController extends Controller {
  declare model: DeliItem[];

  @tracked currentSort: ColumnOutput = { sortColumn: null, sortDirection: null };
  @tracked itemToDelete: DeliItem | null = null;
  @tracked deleteModalOpen = false;

  get deliItemsSort() {
    const sortColumn = this.currentSort.sortColumn;
    const sortDirection = this.currentSort.sortDirection;

    if (isBlank(sortColumn)) {
      return ['title:asc'];
    }

    return [`${sortColumn}:${sortDirection}`];
  }

  @sort('model', 'deliItemsSort')
  declare sortedDeliItems: DeliItem[];

  @action
  sortDeliItems(sort: ColumnOutput) {
    this.currentSort = sort;
  }

  @action
  openDeleteModal(item: DeliItem) {
    this.itemToDelete = item;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
