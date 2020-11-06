import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class DeleteHoursForm extends Component {
  @tracked errorMessage;

  @(task(function* () {
    try {
      yield this.args.hours.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  }).drop())
  deleteHours;
}
