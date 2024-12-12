import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AdminPackageBundlesEditController extends Controller {
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
