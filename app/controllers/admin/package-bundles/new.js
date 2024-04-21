import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AdminPackageBundlesNewController extends Controller {
  @service router;

  @action
  bundleSaved() {
    this.router.transitionTo('admin.package-bundles');
  }

  @action
  bundleCancelled() {
    this.router.transitionTo('admin.package-bundles');
  }
}
