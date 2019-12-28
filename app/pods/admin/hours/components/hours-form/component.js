import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import HoursValidations from 'butchers-market/validations/hour';
import { task } from 'ember-concurrency';

export default class HoursForm extends Component {
  changeset;

  @tracked errorMessage;

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

    if (this.args.hours.isNew) {
      let now = new Date();

      changeset.type = 'Store';
      changeset.activeStartDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      );
      changeset.activeEndDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
    }

    this.changeset = changeset;
  }

  @(task(function*() {
    yield this.changeset.validate();

    if (!this.changeset.isValid) {
      return;
    }

    try {
      yield this.changeset.save();
      this.args.saved();
    } catch (ex) {
      if (ex.body) {
        this.errorMessage = ex.body.error;
      } else {
        this.errorMessage = ex;
      }
    }
  }).drop())
  saveHours;

  @action
  startDateSelected(date) {
    this.changeset.activeStartDate = new Date(
      date[0].getFullYear(),
      date[0].getMonth(),
      date[0].getDate(),
      0,
      0,
      0
    );
  }

  @action
  endDateSelected(date) {
    this.changeset.activeEndDate = new Date(
      date[0].getFullYear(),
      date[0].getMonth(),
      date[0].getDate(),
      23,
      59,
      59
    );
  }
}
