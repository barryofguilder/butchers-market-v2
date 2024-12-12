import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class DeleteDeliItemFormComponent extends Component {
  @tracked errorMessage;

  deleteItem = dropTask(async () => {
    try {
      await this.args.item.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });
}
