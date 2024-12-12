import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { dropTask } from 'ember-concurrency';
import FeatureFlagValidations from '../../../validations/feature-flag';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class FeatureFlagFormComponent extends Component {
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
      this.args.flag,
      lookupValidator(FeatureFlagValidations),
      FeatureFlagValidations,
    );
    this.changeset = changeset;
  }

  saveFlag = dropTask(async () => {
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
  updateActive() {
    this.changeset.set('active', !this.changeset.get('active'));
  }
}
