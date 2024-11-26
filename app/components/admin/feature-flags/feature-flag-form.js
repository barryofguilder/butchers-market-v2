import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { dropTask } from 'ember-concurrency';
import FeatureFlagValidations from '../../../validations/feature-flag';

export default class FeatureFlagFormComponent extends Component {
  @service router;
  @service session;

  changeset;

  @tracked errorMessage;

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
      if (ex.status === 401) {
        return this.session.redirectToSignIn(this.router.currentURL);
      } else if (ex.body) {
        this.errorMessage = ex.body.error;
      } else {
        this.errorMessage = ex;
      }
    }
  });

  @action
  updateActive() {
    this.changeset.set('active', !this.changeset.get('active'));
  }
}
