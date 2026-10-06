import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { dropTask } from 'ember-concurrency';
import type { Menu } from '../../../schemas/menu';
import type SessionService from '../../../services/session';
import type Store from '../../../services/store';
import MenuValidations from '../../../validations/menu';
import FormState from '../../../utils/form-state';
import { PdfUpload } from '../../../utils/file-upload';
import { saveRecord } from '../../../utils/records';
import { getErrorMessageFromException, isUnauthorized } from '../../../utils/error-handling';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';
import Required from '../required';

interface MenuFormSignature {
  Args: {
    menu: Menu;
    cancelled: () => void;
    saved: () => void;
  };
}

export default class MenuFormComponent extends Component<MenuFormSignature> {
  @service declare router: RouterService;
  @service declare session: SessionService;
  @service declare store: Store;

  form = new FormState(this.args.menu, MenuValidations, (record) => saveRecord(this.store, record));
  pdf = new PdfUpload(this, this.form);

  @tracked errorMessage: string | null = null;

  get hasErrors() {
    return this.errorMessage || this.pdf.errorMessage || this.form.isInvalid;
  }

  get saveDisabled() {
    return this.form.isInvalid;
  }

  saveMenu = dropTask(async () => {
    this.form.validate();

    if (!this.form.isValid) {
      return;
    }

    this.errorMessage = null;

    try {
      if (!(await this.pdf.upload())) {
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

  <template>
    <AdminForm class="max-w-xl" @onSubmit={{this.saveMenu.perform}} as |Form|>
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

      <Form.group data-test-id="file" @model={{this.form}} @property="fileUrl" as |Group|>
        <Group.label>PDF File <Required /></Group.label>
        <Group.pdf @pdf={{this.pdf}} @title="Menu PDF" />
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
