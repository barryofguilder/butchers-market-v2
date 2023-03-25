import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { sort } from '@ember/object/computed';

export default class AdminPackageBundlesIndexController extends Controller {
  @tracked bundleToDelete = null;
  @tracked deleteModalOpen = false;

  bundlesSort = ['displayOrder:asc'];

  @sort('model', 'bundlesSort')
  sortedBundles;

  @action
  openDeleteModal(item) {
    this.bundleToDelete = item;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
