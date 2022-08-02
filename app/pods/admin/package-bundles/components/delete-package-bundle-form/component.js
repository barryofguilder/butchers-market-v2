import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class DeletePackageBundleFormComponent extends Component {
  @tracked errorMessage;

  @dropTask
  *deleteBundle() {
    try {
      yield this.args.bundle.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  }
}
