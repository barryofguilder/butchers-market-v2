import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency-decorators';

export default class DeleteHoursForm extends Component {
  @tracked errorMessage;

  @dropTask
  *deleteHours() {
    try {
      yield this.args.hours.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  }
}
