import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AdminMeatBundlesIndexController extends Controller {
  @tracked bundleToDelete = null;
  @tracked deleteModalOpen = false;

  @action
  openDeleteModal(bundle) {
    this.bundleToDelete = bundle;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
