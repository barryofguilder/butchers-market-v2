import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AdminFeatureFlagsController extends Controller {
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
