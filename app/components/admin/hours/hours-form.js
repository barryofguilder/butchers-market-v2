import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { dropTask } from 'ember-concurrency';
import HoursValidations from '../../../validations/hour';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class HoursFormComponent extends Component {
  changeset;

  @tracked errorMessage;

  get hasErrors() {
    return this.errorMessage || this.changeset.errors;
  }

  get saveDisabled() {
    return this.changeset && this.changeset.isInvalid;
  }

  constructor() {
    super(...arguments);

    let changeset = new Changeset(
      this.args.hours,
      lookupValidator(HoursValidations),
      HoursValidations
    );

    this.changeset = changeset;
  }

  saveHours = dropTask(async () => {
    await this.changeset.validate();

    if (!this.changeset.isValid) {
      return;
    }

    try {
      await this.changeset.save();
      this.args.saved();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });

  @action
  startDateSelected(date) {
    this.changeset.set(
      'activeStartDate',
      new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate(), 0, 0, 0)
    );
  }

  @action
  endDateSelected(date) {
    this.changeset.set(
      'activeEndDate',
      new Date(date[0].getFullYear(), date[0].getMonth(), date[0].getDate(), 23, 59, 59)
    );
  }
}
