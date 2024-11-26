import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AdminGrabAndGoIndexController extends Controller {
  @tracked showErrorMessage;
  @tracked itemToDelete = null;
  @tracked deleteModalOpen = false;

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
