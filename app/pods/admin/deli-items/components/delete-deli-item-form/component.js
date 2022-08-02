import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class DeleteDeliItemFormComponent extends Component {
  @tracked errorMessage;

  @dropTask
  *deleteItem() {
    try {
      yield this.args.item.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  }
}
