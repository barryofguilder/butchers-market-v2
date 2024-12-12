import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class DeleteHoursFormComponent extends Component {
  @tracked errorMessage;

  deleteHours = dropTask(async () => {
    try {
      await this.args.hours.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });
}
