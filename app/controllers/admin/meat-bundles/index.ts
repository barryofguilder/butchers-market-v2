import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import type MeatBundleAdapter from '../../../adapters/meat-bundle';
import type MeatBundle from '../../../models/meat-bundle';

export default class AdminMeatBundlesIndexController extends Controller {
  @service declare store: Store;

  @tracked showErrorMessage = false;
  @tracked bundleToDelete: MeatBundle | null = null;
  @tracked deleteModalOpen = false;

  @action
  reorderItems(itemModels: MeatBundle[]) {
    this.saveBundleOrdering.perform(itemModels);
  }

  saveBundleOrdering = dropTask(async (bundles: MeatBundle[]) => {
    this.showErrorMessage = false;

    try {
      // The table sorts on `displayOrder`, so setting it here is what moves the row.
      bundles.forEach((bundle, index) => {
        bundle.displayOrder = index + 1;
      });

      const adapter = this.store.adapterFor('meat-bundle') as MeatBundleAdapter;
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
  openDeleteModal(bundle: MeatBundle) {
    this.bundleToDelete = bundle;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
