import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class DeletePackageBundleFormComponent extends Component {
  @tracked errorMessage;

  deleteBundle = dropTask(async () => {
    try {
      await this.args.bundle.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });
}
