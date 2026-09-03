import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class AdminMeatBundlesIndexController extends Controller {
  @service store;

  @tracked showErrorMessage;
  @tracked bundleToDelete = null;
  @tracked deleteModalOpen = false;

  @action
  reorderItems(itemModels) {
    this.saveBundleOrdering.perform(itemModels);
  }

  saveBundleOrdering = dropTask(async (bundles) => {
    this.showErrorMessage = false;

    try {
      // The table sorts on `displayOrder`, so setting it here is what moves the row.
      bundles.forEach((bundle, index) => {
        bundle.displayOrder = index + 1;
      });

      const adapter = this.store.adapterFor('meat-bundle');
      const response = await adapter.reorderMeatBundles(bundles);

      if (!response.ok) {
        this.showErrorMessage = true;
      }
    } catch (ex) {
      this.showErrorMessage = true;
      console.error(ex);
    }
  });

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
