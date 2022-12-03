import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class DeleteSpecialFormComponent extends Component {
  @tracked errorMessage;

  deleteSpecial = dropTask(async () => {
    try {
      await this.args.special.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  });
}
