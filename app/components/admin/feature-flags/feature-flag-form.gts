import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency';
import type FeatureFlag from '../../../models/feature-flag';
import FeatureFlagValidations from '../../../validations/feature-flag';
import FormState from '../../../utils/form-state';
import { getErrorMessageFromException } from '../../../utils/error-handling';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';
import Required from '../required';

interface FeatureFlagFormSignature {
  Args: {
    flag: FeatureFlag;
    cancelled: () => void;
    saved: () => void;
  };
}

export default class FeatureFlagFormComponent extends Component<FeatureFlagFormSignature> {
  form = new FormState(this.args.flag, FeatureFlagValidations);

  @tracked errorMessage: string | null = null;

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

  updateActive = () => {
    this.form.set('active', !this.form.get('active'));
  };

  <template>
    <AdminForm class='max-w-xl' @onSubmit={{this.saveFlag.perform}} as |Form|>
      {{#if this.errorMessage}}
        <UiAlert data-test-id='server-error' @variant='danger'>
          {{this.errorMessage}}
        </UiAlert>
      {{/if}}

      <p class='mb-8'>
        <strong>Note:</strong>
        Required fields are marked with an
        <Required />
      </p>

      <Form.group data-test-id='name' @model={{this.form}} @property='name' as |Group|>
        <Group.label>Name <Required /></Group.label>
        <Group.textbox @value={{this.form.values.name}} @onChange={{this.form.setter 'name'}} />
      </Form.group>

      <Form.group data-test-id='active' @model={{this.form}} @property='active' as |Group|>
        <Group.checkbox @checked={{this.form.values.active}} @onChange={{this.updateActive}}>
          Is Active?
        </Group.checkbox>
      </Form.group>

      <div class='mt-8'>
        {{#if this.hasErrors}}
          <div class='mb-2 text-red-600'>
            There are errors in the form above.
          </div>
        {{/if}}
        <Form.submit @disabled={{this.saveDisabled}}>
          Save
        </Form.submit>
        <UiButton class='ml-2' @variant='plain' @onClick={{@cancelled}}>Cancel</UiButton>
      </div>
    </AdminForm>
  </template>
}
