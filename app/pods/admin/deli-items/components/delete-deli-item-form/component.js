import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class DeleteDeliItemFormComponent extends Component {
  @tracked errorMessage;

  deleteItem = dropTask(async () => {
    try {
      await this.args.item.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  });
}
