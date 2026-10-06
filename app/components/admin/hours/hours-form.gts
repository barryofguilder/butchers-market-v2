import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { dropTask } from 'ember-concurrency';
import type { Hour } from '../../../schemas/hour';
import HoursValidations from '../../../validations/hour';
import type Store from '../../../services/store';
import FormState from '../../../utils/form-state';
import { saveRecord } from '../../../utils/records';
import { getErrorMessageFromException } from '../../../utils/error-handling';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import UiRadioInput from '../../ui-radio-input';
import AdminForm from '../admin-form';
import Required from '../required';

interface HoursFormSignature {
  Args: {
    hours: Hour;
    cancelled: () => void;
    saved: () => void;
  };
}

export default class HoursFormComponent extends Component<HoursFormSignature> {
  @service declare store: Store;

  form = new FormState(this.args.hours, HoursValidations, (record) =>
    saveRecord(this.store, record)
  );

  @tracked errorMessage: string | null = null;

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
      await this.form.submit();
      this.args.saved();
    } catch (ex) {
      this.errorMessage = await getErrorMessageFromException(ex);
    }
  });

  startDateSelected = ([date]: Date[]) => {
    if (date) {
      this.form.set(
        'activeStartDate',
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
      );
    }
  };

  endDateSelected = ([date]: Date[]) => {
    if (date) {
      this.form.set(
        'activeEndDate',
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
      );
    }
  };

  <template>
    <AdminForm class="max-w-xl" @onSubmit={{this.saveHours.perform}} as |Form|>
      {{#if this.errorMessage}}
        <UiAlert data-test-id="server-error" @variant="danger">
          {{this.errorMessage}}
        </UiAlert>
      {{/if}}

      <p class="mb-8">
        <strong>Note:</strong>
        Required fields are marked with an
        <Required />
      </p>

      <Form.group data-test-id="type" @model={{this.form}} @property="type" as |Group|>
        <Group.label>
          Type
          {{#if @hours.isNew}}<Required />{{/if}}
        </Group.label>
        {{#if @hours.isNew}}
          <div class="flex mt-2">
            <label class="flex items-center">
              <UiRadioInput
                @name="type-store"
                @value="Store"
                @groupValue={{this.form.values.type}}
                @onChange={{this.form.setter "type"}}
              />
              <span class="ml-2">Store</span>
            </label>
            <label class="ml-4 flex items-center">
              <UiRadioInput
                @name="type-cafe"
                @value="Cafe"
                @groupValue={{this.form.values.type}}
                @onChange={{this.form.setter "type"}}
              />
              <span class="ml-2">Cafe</span>
            </label>
          </div>
        {{else}}
          <Group.readonly @value={{this.form.values.type}} />
        {{/if}}
      </Form.group>

      <Form.group data-test-id="label" @model={{this.form}} @property="label" as |Group|>
        <Group.label>Label <Required /></Group.label>
        <Group.textbox @value={{this.form.values.label}} @onChange={{this.form.setter "label"}} />
      </Form.group>

      {{#unless this.form.values.default}}
        <Form.group
          data-test-id="start-date"
          @model={{this.form}}
          @property="activeStartDate"
          as |Group|
        >
          <Group.label>Active Start Date <Required /></Group.label>
          <Group.datepicker
            @allowInput={{false}}
            @date={{this.form.values.activeStartDate}}
            @dateFormat="m/d/Y"
            @onChange={{this.startDateSelected}}
          />
          <Group.help>
            The date that these hours will become active on.
          </Group.help>
        </Form.group>

        <Form.group
          data-test-id="end-date"
          @model={{this.form}}
          @property="activeEndDate"
          as |Group|
        >
          <Group.label>Active End Date <Required /></Group.label>
          <Group.datepicker
            @allowInput={{false}}
            @date={{this.form.values.activeEndDate}}
            @dateFormat="m/d/Y"
            @onChange={{this.endDateSelected}}
          />
          <Group.help>
            The last date that these hours will be active on.
          </Group.help>
        </Form.group>
      {{/unless}}

      <Form.group data-test-id="line1" @model={{this.form}} @property="line1" as |Group|>
        <Group.label>Line 1 <Required /></Group.label>
        <Group.textbox @value={{this.form.values.line1}} @onChange={{this.form.setter "line1"}} />
      </Form.group>

      <Form.group data-test-id="line2" @model={{this.form}} @property="line2" as |Group|>
        <Group.label>Line 2</Group.label>
        <Group.textbox @value={{this.form.values.line2}} @onChange={{this.form.setter "line2"}} />
      </Form.group>

      <Form.group data-test-id="line3" @model={{this.form}} @property="line3" as |Group|>
        <Group.label>Line 3</Group.label>
        <Group.textbox @value={{this.form.values.line3}} @onChange={{this.form.setter "line3"}} />
      </Form.group>

      <div class="mt-8">
        {{#if this.hasErrors}}
          <div class="mb-2 text-red-600">
            There are errors in the form above.
          </div>
        {{/if}}
        <Form.submit @disabled={{this.saveDisabled}}>
          Save
        </Form.submit>
        <UiButton class="ml-2" @variant="plain" @onClick={{@cancelled}}>Cancel</UiButton>
      </div>
    </AdminForm>
  </template>
}
