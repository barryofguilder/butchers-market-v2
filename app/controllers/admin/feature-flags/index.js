import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AdminFeatureFlagsIndexController extends Controller {
  @tracked flagToDelete = null;
  @tracked deleteModalOpen = false;

  @action
  openDeleteModal(flag) {
    this.flagToDelete = flag;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
