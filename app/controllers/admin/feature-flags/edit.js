import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AdminFeatureFlagsEditController extends Controller {
  @service router;

  @action
  flagSaved() {
    this.router.transitionTo('admin.feature-flags');
  }

  @action
  flagCancelled() {
    this.router.transitionTo('admin.feature-flags');
  }
}
