import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';

export default class DeleteHoursFormComponent extends Component {
  @tracked errorMessage;

  deleteHours = dropTask(async () => {
    try {
      await this.args.hours.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  });
}
