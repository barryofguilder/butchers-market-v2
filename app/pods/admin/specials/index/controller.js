import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class AdminSpecialsIndexController extends Controller {
  @service store;

  @tracked showErrorMessage;
  @tracked specials = this.model;
  @tracked specialToDelete = null;
  @tracked deleteModalOpen = false;

  @action
  reorderItems(itemModels) {
    this.specials = itemModels;
    this.saveSpecialOrdering.perform();
  }

  saveSpecialOrdering = dropTask(async () => {
    this.showErrorMessage = false;

    try {
      for (let i = 0; i < this.specials.length; i++) {
        this.specials[i].displayOrder = i + 1;
      }

      const adapter = this.store.adapterFor('special');
      const response = await adapter.reorderSpecials(this.specials);

      if (response.status !== 201) {
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
