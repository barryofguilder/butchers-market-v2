import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class AdminForm extends Component {
  @task(function* () {
    if (this.args.onSubmit) {
      yield this.args.onSubmit();
    }

    if (this.args.afterSubmit) {
      yield this.args.afterSubmit();
    }
  })
  submitTask;

  @action
  submit(event) {
    event.preventDefault();
    this.submitTask.perform();
  }
}
