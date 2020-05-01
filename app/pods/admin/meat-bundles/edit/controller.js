import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdminMeatBundlesEditController extends Controller {
  @action
  bundleSaved() {
    this.transitionToRoute('admin.meat-bundles');
  }

  @action
  bundleCancelled() {
    this.transitionToRoute('admin.meat-bundles');
  }
}
