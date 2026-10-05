import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

export default class AdminFeatureFlagsEditController extends Controller {
  @service declare router: RouterService;

  @action
  flagSaved() {
    this.router.transitionTo('admin.feature-flags');
  }

  @action
  flagCancelled() {
    this.router.transitionTo('admin.feature-flags');
  }
}
