import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency-decorators';

export default class DeleteEventForm extends Component {
  @tracked errorMessage;

  @dropTask
  *deleteEvent() {
    try {
      yield this.args.event.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  }
}
