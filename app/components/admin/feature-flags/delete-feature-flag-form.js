import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class DeleteFeatureFlagFormComponent extends Component {
  @tracked errorMessage;

  deleteFlag = dropTask(async () => {
    try {
      await this.args.flag.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });
}
