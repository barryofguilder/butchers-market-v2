import Component from '@glimmer/component';
import { action } from '@ember/object';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';

export default class UiPagination extends Component {
  pageSizes = [10, 20, 50, 100];

  get page() {
    return valueOrDefault(this.args.page, 1);
  }

  get pageSize() {
    return valueOrDefault(this.args.pageSize, 0);
  }

  get totalPages() {
    return valueOrDefault(this.args.totalPages, 0);
  }

  get totalResults() {
    return valueOrDefault(this.args.totalResults, 0);
  }

  get hasPages() {
    return this.totalPages > 1;
  }

  get onPageChange() {
    return valueOrDefault(this.args.onPageChange, () => {});
  }

  get onPageSizeChange() {
    return valueOrDefault(this.args.onPageSizeChange, () => {});
  }

  @action
  incrementPage(number) {
    const currentPage = parseInt(this.page);
    const totalPages = parseInt(this.totalPages);

    if (currentPage === totalPages && number === 1) {
      return false;
    }

    if (currentPage <= 1 && number === -1) {
      return false;
    }

    const newPageNumber = currentPage + number;
    this.onPageChange(newPageNumber);
  }
}
