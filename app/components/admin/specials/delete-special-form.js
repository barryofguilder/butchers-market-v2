import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class DeleteSpecialFormComponent extends Component {
  @tracked errorMessage;

  deleteSpecial = dropTask(async () => {
    try {
      await this.args.special.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });
}
