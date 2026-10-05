import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type FeatureFlag from '../../../models/feature-flag';

export default class AdminFeatureFlagsIndexController extends Controller {
  @tracked flagToDelete: FeatureFlag | null = null;
  @tracked deleteModalOpen = false;

  @action
  openDeleteModal(flag: FeatureFlag) {
    this.flagToDelete = flag;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
