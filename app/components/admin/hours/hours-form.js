import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import HoursValidations from '../../../validations/hour';
import FormState from '../../../utils/form-state';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class HoursFormComponent extends Component {
  form = new FormState(this.args.hours, HoursValidations);

  @tracked errorMessage;

  get hasErrors() {
    return this.errorMessage || this.form.isInvalid;
  }

  get saveDisabled() {
    return this.form.isInvalid;
  }

  saveHours = dropTask(async () => {
    this.form.validate();

    if (!this.form.isValid) {
      return;
    }

    try {
      await this.form.save();
      this.args.saved();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });

  @action
  startDateSelected(date) {
    this.form.set(
      'activeStartDate',
      new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate(), 0, 0, 0)
    );
  }

  @action
  endDateSelected(date) {
    this.form.set(
      'activeEndDate',
      new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate(), 23, 59, 59)
    );
  }
}
