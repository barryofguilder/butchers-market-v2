import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class AdminFormComponent extends Component {
  submitTask = task(async () => {
    if (this.args.onSubmit) {
      await this.args.onSubmit();
    }

    if (this.args.afterSubmit) {
      await this.args.afterSubmit();
    }
  });

  @action
  submit(event) {
    event.preventDefault();
    this.submitTask.perform();
  }
}
