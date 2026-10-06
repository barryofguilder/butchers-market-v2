import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { dropTask, enqueueTask } from 'ember-concurrency';
import type { UploadFile } from 'ember-file-upload';
import fileQueue from 'ember-file-upload/helpers/file-queue';
import type { DeliItem } from '../../../schemas/deli-item';
import type SessionService from '../../../services/session';
import type Store from '../../../services/store';
import DeliItemValidations from '../../../validations/deli-item';
import FormState from '../../../utils/form-state';
import { saveRecord } from '../../../utils/records';
import baseUrl from '../../../utils/base-url';
import { generateFileName } from '../../../utils/file-name';
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

  @tracked image: UploadFile | null = null;
  @tracked tempImageUrl: string | null = null;
  @tracked errorMessage: string | null = null;
  @tracked fileErrorMessage: string | null = null;

  get hasErrors() {
    return this.errorMessage || this.form.isInvalid;
  }

  get hasImage() {
    return this.form.get('imageUrl') || this.tempImageUrl;
  }

  get imageUrl() {
    if (this.tempImageUrl) {
      return this.tempImageUrl;
    }

    return this.form.get('imageUrlPath');
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

  saveItem = dropTask(async () => {
    this.form.validate();

    if (!this.form.isValid) {
      return;
    }

    try {
      if (this.image) {
        const generatedFileName = generateFileName(this.image);
        await this.image.upload(`${baseUrl}/upload`, {
          headers: this.uploadHeaders,
          data: { generatedFileName },
        });
        this.form.set('imageUrl', generatedFileName);
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

  uploadPhoto = enqueueTask({ maxConcurrency: 3 }, async (file: UploadFile) => {
    try {
      const url = (await file.readAsDataURL()) as string;
      this.tempImageUrl = url;
      this.image = file;

      // Only setting this to make the validation happy. It gets set to the actual url on save.
      this.form.set('imageUrl', url);
    } catch {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  });

  updateHidden = () => {
    this.form.set('isHidden', !this.form.get('isHidden'));
  };

  uploadImage = (file: UploadFile) => {
    this.uploadPhoto.perform(file);
  };

  removeImage = () => {
    this.image = null;
    this.tempImageUrl = null;

    this.form.set('imageUrl', null);
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
        <div class="mt-2">
          {{#let (fileQueue name="photos" onFileAdded=this.uploadImage) as |queue|}}
            <label for={{Group.uniqueId}}>
              <span
                class="inline-block px-4 py-2 text-sm border cursor-pointer hover:bg-gray-200 focus:outline-hidden focus:ring-3 focus:ring-blue-500"
              >
                Select Image
              </span>
              <input
                type="file"
                id={{Group.uniqueId}}
                accept="image/*"
                hidden
                {{queue.selectFile}}
              />
            </label>
          {{/let}}

          {{#if this.hasImage}}
            <button
              type="button"
              class="inline-block ml-2 px-4 py-2 text-sm border cursor-pointer hover:bg-gray-200 focus:outline-hidden focus:ring-3 focus:ring-blue-500"
              {{on "click" this.removeImage}}
            >
              Remove Image
            </button>
          {{/if}}

          <small class="block mt-3 text-gray-700 sm:inline-block sm:mt-0 sm:ml-2">
            Only JPG, JPEG, PNG, and GIF files are allowed.
          </small>

          {{#if this.fileErrorMessage}}
            <span class="block mt-2 text-red-600">
              {{this.fileErrorMessage}}
            </span>
          {{/if}}

          {{#if this.hasImage}}
            <div class="mt-4">
              <img src={{this.imageUrl}} alt="Deli item" class="w-full block" />
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
