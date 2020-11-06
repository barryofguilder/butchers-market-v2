import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency-decorators';

export default class DeletePerformanceForm extends Component {
  @tracked errorMessage;

  @dropTask
  *deletePerformance() {
    try {
      yield this.args.performance.destroyRecord();
      this.args.onSave();
    } catch (ex) {
      this.errorMessage = ex;
    }
  }
}
