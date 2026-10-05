import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import FeatureFlagValidations from '../../../validations/feature-flag';
import FormState from '../../../utils/form-state';
import { getErrorMessageFromException } from '../../../utils/error-handling';

export default class FeatureFlagFormComponent extends Component {
  form = new FormState(this.args.flag, FeatureFlagValidations);

  @tracked errorMessage;

  get hasErrors() {
    return this.errorMessage || this.form.isInvalid;
  }

  get saveDisabled() {
    return this.form.isInvalid;
  }

  saveFlag = dropTask(async () => {
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
  updateActive() {
    this.form.set('active', !this.form.get('active'));
  }
}
