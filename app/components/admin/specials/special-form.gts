import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type Owner from '@ember/owner';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { dropTask } from 'ember-concurrency';
import type { Special } from '../../../schemas/special';
import type SessionService from '../../../services/session';
import type Store from '../../../services/store';
import SpecialValidations from '../../../validations/special';
import FormState from '../../../utils/form-state';
import ImageUpload from '../../../utils/image-upload';
import { saveRecord } from '../../../utils/records';
import { ORDER_ONLINE_URL } from '../../../utils/config';
import { getErrorMessageFromException, isUnauthorized } from '../../../utils/error-handling';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';
import Required from '../required';

interface SpecialFormSignature {
  Args: {
    special: Special;
    cancelled: () => void;
    saved: () => void;
  };
}

export default class SpecialFormComponent extends Component<SpecialFormSignature> {
  @service declare router: RouterService;
  @service declare session: SessionService;
  @service declare store: Store;

  form: FormState<Special>;
  image: ImageUpload<Special>;
  orderOnlineUrl = ORDER_ONLINE_URL;

  @tracked activeDuringRange = false;
  @tracked errorMessage: string | null = null;

  get hasErrors() {
    return this.errorMessage || this.image.errorMessage || this.form.isInvalid;
  }

  get saveDisabled() {
    return this.form.isInvalid;
  }

  constructor(owner: Owner, args: SpecialFormSignature['Args']) {
    super(owner, args);

    this.form = new FormState(this.args.special, SpecialValidations, (special) =>
      saveRecord(this.store, special)
    );
    this.image = new ImageUpload(this, this.form);

    if (this.form.get('activeStartDate')) {
      this.activeDuringRange = true;
    }
  }

  saveSpecial = dropTask(async () => {
    this.form.validate();

    if (!this.form.isValid) {
      return;
    }

    this.errorMessage = null;

    try {
      if (!(await this.image.upload())) {
        return;
      }

      await this.form.submit();
      this.args.saved();
    } catch (ex) {
      if (isUnauthorized(ex)) {
        return this.session.redirectToSignIn(this.router.currentURL ?? '');
      } else {
        this.errorMessage = await getErrorMessageFromException(ex);
      }
    }
  });

  toggleActiveDuringRange = (checked: boolean) => {
    this.activeDuringRange = checked;

    if (this.activeDuringRange === false) {
      this.form.set('activeStartDate', null);
      this.form.set('activeEndDate', null);
    }
  };

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

  updateInStock = () => {
    this.form.set('inStock', !this.form.get('inStock'));
  };

  updateIsHidden = () => {
    this.form.set('isHidden', !this.form.get('isHidden'));
  };

  <template>
    <AdminForm class="max-w-xl" @onSubmit={{this.saveSpecial.perform}} as |Form|>
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

      <Form.group data-test-id="title" @model={{this.form}} @property="title" as |Group|>
        <Group.label>Title <Required /></Group.label>
        <Group.textbox @value={{this.form.values.title}} @onChange={{this.form.setter "title"}} />
      </Form.group>

      <Form.group data-test-id="link" @model={{this.form}} @property="link" as |Group|>
        <Group.label>Link</Group.label>
        <Group.textbox @value={{this.form.values.link}} @onChange={{this.form.setter "link"}} />
        <small class="block mt-3 text-gray-700">
          If left blank, clicking on the special image will take you to
          {{this.orderOnlineUrl}}.
        </small>
      </Form.group>

      <Form.group data-test-id="image" @model={{this.form}} @property="imageUrl" as |Group|>
        <Group.label>Image <Required /></Group.label>
        <Group.image @image={{this.image}} @alt="Special" />
      </Form.group>

      <Form.group
        data-test-id="image-alt-text"
        @model={{this.form}}
        @property="imageAltText"
        as |Group|
      >
        <Group.label>
          Image Alt Text
          <Required />
        </Group.label>
        <Group.textbox
          @value={{this.form.values.imageAltText}}
          @onChange={{this.form.setter "imageAltText"}}
        />
        <small class="block mt-3 text-gray-700">
          The text that people will see when there is no image or the user is blind. Just needs to
          describe the special.
        </small>
      </Form.group>

      <Form.group data-test-id="active-during-range" as |Group|>
        <Group.checkbox
          @checked={{this.activeDuringRange}}
          @onChange={{this.toggleActiveDuringRange}}
        >
          Active during a certain date range?
        </Group.checkbox>
        <Group.help>
          When checked, this means that the special will only be active during a specified date
          range.
        </Group.help>
      </Form.group>

      {{#if this.activeDuringRange}}
        <Form.group
          data-test-id="start-date"
          @model={{this.form}}
          @property="activeStartDate"
          as |Group|
        >
          <Group.label>Active Start Date</Group.label>
          <Group.datepicker
            @allowInput={{false}}
            @date={{this.form.values.activeStartDate}}
            @dateFormat="m/d/Y"
            @onChange={{this.startDateSelected}}
          />
          <Group.help>
            The date that this special will become active on.
          </Group.help>
        </Form.group>

        <Form.group
          data-test-id="end-date"
          @model={{this.form}}
          @property="activeEndDate"
          as |Group|
        >
          <Group.label>Active End Date</Group.label>
          <Group.datepicker
            @allowInput={{false}}
            @date={{if this.form.values.activeEndDate this.form.values.activeEndDate null}}
            @dateFormat="m/d/Y"
            @onChange={{this.endDateSelected}}
          />
          <Group.help>
            The last date that the special will be active on.
          </Group.help>
        </Form.group>
      {{/if}}

      <Form.group data-test-id="in-stock" @model={{this.form}} @property="inStock" as |Group|>
        <Group.checkbox @checked={{this.form.values.inStock}} @onChange={{this.updateInStock}}>
          In Stock?
        </Group.checkbox>
      </Form.group>

      <Form.group data-test-id="hidden" @model={{this.form}} @property="isHidden" as |Group|>
        <Group.checkbox @checked={{this.form.values.isHidden}} @onChange={{this.updateIsHidden}}>
          Is Hidden?
        </Group.checkbox>
        <Group.help>
          When checked, this means that the special will be hidden even if there is an active date
          range set.
        </Group.help>
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
