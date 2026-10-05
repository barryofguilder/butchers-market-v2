import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

export default class AdminMeatBundlesEditController extends Controller {
  @service declare router: RouterService;

  @action
  bundleSaved() {
    this.router.transitionTo('admin.meat-bundles');
  }

  @action
  bundleCancelled() {
    this.router.transitionTo('admin.meat-bundles');
  }
}
