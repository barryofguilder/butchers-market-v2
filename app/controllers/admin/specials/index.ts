import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import type SpecialAdapter from '../../../adapters/special';
import type Special from '../../../models/special';

export default class AdminSpecialsIndexController extends Controller {
  @service declare store: Store;

  @tracked showErrorMessage = false;
  @tracked specialToDelete: Special | null = null;
  @tracked deleteModalOpen = false;

  @action
  reorderItems(itemModels: Special[]) {
    this.saveSpecialOrdering.perform(itemModels);
  }

  saveSpecialOrdering = dropTask(async (specials: Special[]) => {
    this.showErrorMessage = false;

    try {
      // The table sorts on `displayOrder`, so setting it here is what moves the row.
      specials.forEach((special, index) => {
        special.displayOrder = index + 1;
      });

      const adapter = this.store.adapterFor('special') as SpecialAdapter;
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
  openDeleteModal(special: Special) {
    this.specialToDelete = special;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
