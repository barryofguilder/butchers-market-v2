import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class AdminSpecialsIndexController extends Controller {
  @service store;

  @tracked showErrorMessage;
  @tracked specialToDelete = null;
  @tracked deleteModalOpen = false;

  @action
  reorderItems(itemModels) {
    this.saveSpecialOrdering.perform(itemModels);
  }

  saveSpecialOrdering = dropTask(async (specials) => {
    this.showErrorMessage = false;

    try {
      // The table sorts on `displayOrder`, so setting it here is what moves the row.
      specials.forEach((special, index) => {
        special.displayOrder = index + 1;
      });

      const adapter = this.store.adapterFor('special');
      const response = await adapter.reorderSpecials(specials);

      if (!response.ok) {
        this.showErrorMessage = true;
      }
    } catch (ex) {
      this.showErrorMessage = true;
      console.error(ex);
    }
  });

  @action
  openDeleteModal(special) {
    this.specialToDelete = special;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
