import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import PerformanceValidations from 'butchers-market/validations/performance';
import { task } from 'ember-concurrency';

export default class PerformanceForm extends Component {
  changeset;

  @tracked errorMessage;

  get saveDisabled() {
    return this.changeset && this.changeset.isInvalid;
  }

  constructor() {
    super(...arguments);

    let changeset = new Changeset(
      this.args.performance,
      lookupValidator(PerformanceValidations),
      PerformanceValidations
    );
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
  savePerformance;
}
