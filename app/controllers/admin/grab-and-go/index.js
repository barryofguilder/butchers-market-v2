import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export const STOCK_FILTERS = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
  { value: 'all', label: 'All' },
];

export default class AdminGrabAndGoIndexController extends Controller {
  stockFilters = STOCK_FILTERS;

  @tracked showErrorMessage;
  @tracked itemToDelete = null;
  @tracked deleteModalOpen = false;
  @tracked stockFilter = 'in-stock';

  get filteredItems() {
    switch (this.stockFilter) {
      case 'in-stock':
        return this.model.filter((item) => item.inStock);
      case 'out-of-stock':
        return this.model.filter((item) => !item.inStock);
      default:
        return this.model;
    }
  }

  get emptyMessage() {
    switch (this.stockFilter) {
      case 'in-stock':
        return 'No in stock grab and go items found.';
      case 'out-of-stock':
        return 'No out of stock grab and go items found.';
      default:
        return 'No grab and go items found.';
    }
  }

  @action
  setStockFilter(value) {
    this.stockFilter = value;
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
