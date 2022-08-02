import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class AdminFormComponent extends Component {
  @task
  *submitTask() {
    if (this.args.onSubmit) {
      yield this.args.onSubmit();
    }

    if (this.args.afterSubmit) {
      yield this.args.afterSubmit();
    }
  }

  @action
  submit(event) {
    event.preventDefault();
    this.submitTask.perform();
  }
}
