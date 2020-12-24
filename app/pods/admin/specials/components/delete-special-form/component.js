import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency-decorators';

export default class DeleteSpecialFormComponent extends Component {
  @tracked errorMessage;

  @dropTask
  *deleteSpecial() {
    try {
      yield this.args.special.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  }
}
