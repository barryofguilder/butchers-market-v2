import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type Hour from '../../../models/hour';

export default class AdminHoursIndexController extends Controller {
  @tracked hoursToDelete: Hour | null = null;
  @tracked deleteModalOpen = false;

  @action
  openDeleteModal(hours: Hour) {
    this.hoursToDelete = hours;
    this.deleteModalOpen = true;
  }

  @action
  closeDeleteModal() {
    this.deleteModalOpen = false;
  }
}
