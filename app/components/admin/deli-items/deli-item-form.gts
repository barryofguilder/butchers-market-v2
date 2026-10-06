import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { dropTask } from 'ember-concurrency';
import type { DeliItem } from '../../../schemas/deli-item';
import type SessionService from '../../../services/session';
import type Store from '../../../services/store';
import DeliItemValidations from '../../../validations/deli-item';
import FormState from '../../../utils/form-state';
import ImageUpload from '../../../utils/image-upload';
import { saveRecord } from '../../../utils/records';
import { getErrorMessageFromException, isUnauthorized } from '../../../utils/error-handling';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';
import Required from '../required';

interface DeliItemFormSignature {
  Args: {
    item: DeliItem;
    cancelled: () => void;
    saved: () => void;
  };
}

export default class DeliItemFormComponent extends Component<DeliItemFormSignature> {
  @service declare router: RouterService;
  @service declare session: SessionService;
  @service declare store: Store;

  form = new FormState(this.args.item, DeliItemValidations, (item) => saveRecord(this.store, item));
  image = new ImageUpload(this, this.form);

  @tracked errorMessage: string | null = null;

  get hasErrors() {
    return this.errorMessage || this.image.errorMessage || this.form.isInvalid;
  }

  get saveDisabled() {
    return this.form.isInvalid;
  }

  saveItem = dropTask(async () => {
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

  updateHidden = () => {
    this.form.set('isHidden', !this.form.get('isHidden'));
  };

  <template>
    <AdminForm class="max-w-xl" @onSubmit={{this.saveItem.perform}} as |Form|>
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

      <Form.group
        data-test-id="ingredients"
        @model={{this.form}}
        @property="ingredients"
        as |Group|
      >
        <Group.label>Ingredients</Group.label>
        <Group.textarea
          @value={{this.form.values.ingredients}}
          @onChange={{this.form.setter "ingredients"}}
        />
      </Form.group>

      <Form.group data-test-id="hidden" @model={{this.form}} @property="isHidden" as |Group|>
        <Group.checkbox @checked={{this.form.values.isHidden}} @onChange={{this.updateHidden}}>
          Is Hidden?
        </Group.checkbox>
        <Group.help>
          When checked, this means it won't show on your site. Useful when you are rotating what
          deli items you have available.
        </Group.help>
      </Form.group>

      <Form.group data-test-id="image" @model={{this.form}} @property="imageUrl" as |Group|>
        <Group.label>Image <Required /></Group.label>
        <Group.image @image={{this.image}} @alt="Deli item" />
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
