import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { dropTask, enqueueTask } from 'ember-concurrency';
import type { UploadFile } from 'ember-file-upload';
import fileQueue from 'ember-file-upload/helpers/file-queue';
import type { Menu } from '../../../schemas/menu';
import type SessionService from '../../../services/session';
import type Store from '../../../services/store';
import MenuValidations from '../../../validations/menu';
import FormState from '../../../utils/form-state';
import { saveRecord } from '../../../utils/records';
import baseUrl from '../../../utils/base-url';
import { generatePdfFileName } from '../../../utils/file-name';
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

  @tracked file: UploadFile | null = null;
  @tracked tempFileUrl: string | null = null;
  @tracked errorMessage: string | null = null;
  @tracked fileErrorMessage: string | null = null;

  get hasErrors() {
    return this.errorMessage || this.form.isInvalid;
  }

  get hasFile() {
    return this.form.get('fileUrl') || this.tempFileUrl;
  }

  get fileUrl() {
    if (this.tempFileUrl) {
      return this.tempFileUrl;
    }

    return this.form.get('fileUrlPath');
  }

  get saveDisabled() {
    return this.form.isInvalid;
  }

  get uploadHeaders() {
    const token = this.session.token;

    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }

    return undefined;
  }

  saveMenu = dropTask(async () => {
    this.form.validate();

    const hasFile = this.file || this.form.get('fileUrl');

    if (!this.form.isValid || !hasFile) {
      if (!hasFile) {
        this.form.addError('file', 'PDF URL is required');
      }

      return;
    }

    try {
      if (this.file) {
        const generatedFileName = generatePdfFileName(this.file);
        await this.file.upload(`${baseUrl}/upload`, {
          headers: this.uploadHeaders,
          data: { generatedFileName },
        });
        this.form.set('fileUrl', generatedFileName);
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

  uploadFileTask = enqueueTask({ maxConcurrency: 3 }, async (file: UploadFile) => {
    try {
      const url = (await file.readAsDataURL()) as string;
      this.tempFileUrl = url;
      this.file = file;
      this.form.removeError('file');
    } catch {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  });

  uploadFile = (file: UploadFile) => {
    this.form.set('fileUrl', null);
    this.uploadFileTask.perform(file);
  };

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

      <Form.group data-test-id="file" @model={{this.form}} @property="file" as |Group|>
        <Group.label>PDF File <Required /></Group.label>
        <div class="mt-2">
          {{#let (fileQueue name="file" onFileAdded=this.uploadFile) as |queue|}}
            <label for={{Group.uniqueId}}>
              <span
                class="inline-block px-4 py-2 text-sm border cursor-pointer hover:bg-gray-200 focus:outline-hidden focus:ring-3 focus:ring-blue-500"
              >
                Select PDF
              </span>
              <input
                type="file"
                id={{Group.uniqueId}}
                accept="application/pdf"
                hidden
                {{queue.selectFile}}
              />
            </label>
          {{/let}}

          <small class="block mt-3 text-gray-700 sm:inline-block sm:mt-0 sm:ml-2">
            Only PDF are allowed.
          </small>

          {{#if this.fileErrorMessage}}
            <span class="block mt-2 text-red-600">
              {{this.fileErrorMessage}}
            </span>
          {{/if}}

          {{#if this.hasFile}}
            <div class="mt-4">
              <iframe src={{this.fileUrl}} title="Menu PDF" height="600px" class="w-full"></iframe>
            </div>
          {{/if}}
        </div>
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
