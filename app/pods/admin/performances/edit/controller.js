import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdminPerformancesEditController extends Controller {
  @action
  performanceSaved() {
    this.transitionToRoute('admin.performances');
  }

  @action
  performanceCancelled() {
    this.transitionToRoute('admin.performances');
  }
}
