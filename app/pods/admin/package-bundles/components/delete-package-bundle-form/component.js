import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class DeletePackageBundleForm extends Component {
  @tracked errorMessage;

  @(task(function*() {
    try {
      yield this.args.bundle.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  }).drop())
  deleteBundle;
}
