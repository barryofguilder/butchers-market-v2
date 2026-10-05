import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { sort } from '@ember/object/computed';
import type PackageBundle from '../../../models/package-bundle';

export default class AdminPackageBundlesIndexController extends Controller {
  declare model: PackageBundle[];

  @tracked bundleToDelete: PackageBundle | null = null;
  @tracked deleteModalOpen = false;

  bundlesSort = ['displayOrder:asc'];

  @sort('model', 'bundlesSort')
  declare sortedBundles: PackageBundle[];

  @action
  openDeleteModal(item: PackageBundle) {
    this.bundleToDelete = item;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
