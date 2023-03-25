import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AdminHoursIndexController extends Controller {
  @tracked hoursToDelete = null;
  @tracked deleteModalOpen = false;

  @action
  openDeleteModal(hours) {
    this.hoursToDelete = hours;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
