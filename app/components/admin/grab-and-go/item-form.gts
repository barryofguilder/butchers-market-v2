import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { dropTask, enqueueTask } from 'ember-concurrency';
import type { UploadFile } from 'ember-file-upload';
import fileQueue from 'ember-file-upload/helpers/file-queue';
import type { GrabAndGo } from '../../../schemas/grab-and-go';
import type SessionService from '../../../services/session';
import type Store from '../../../services/store';
import ItemValidations from '../../../validations/grab-and-go';
import FormState from '../../../utils/form-state';
import { saveRecord } from '../../../utils/records';
import baseUrl from '../../../utils/base-url';
import { generateFileName } from '../../../utils/file-name';
import { getErrorMessageFromException, isUnauthorized } from '../../../utils/error-handling';
import UiAlert from '../../ui-alert';
import UiButton from '../../ui-button';
import AdminForm from '../admin-form';
import Required from '../required';

interface ItemFormSignature {
  Args: {
    item: GrabAndGo;
    cancelled: () => void;
    saved: () => void;
  };
}

export default class ItemFormComponent extends Component<ItemFormSignature> {
  @service declare router: RouterService;
  @service declare session: SessionService;
  @service declare store: Store;

  form = new FormState(this.args.item, ItemValidations, (item) => saveRecord(this.store, item));

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
    } catch {
      this.fileErrorMessage = 'Could not read the file contents';
    }
  });

  uploadImage = (file: UploadFile) => {
    this.form.set('imageUrl', null);
    this.uploadPhoto.perform(file);
  };

  removeImage = () => {
    this.image = null;
    this.tempImageUrl = null;

    this.form.set('imageUrl', null);
  };

  updateInStock = () => {
    this.form.set('inStock', !this.form.get('inStock'));
  };

  updateIsHoliday = () => {
    this.form.set('isHoliday', !this.form.get('isHoliday'));
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
        data-test-id="social-title"
        @model={{this.form}}
        @property="socialTitle"
        as |Group|
      >
        <Group.label>Social Title</Group.label>
        <Group.textbox
          @value={{this.form.values.socialTitle}}
          @onChange={{this.form.setter "socialTitle"}}
        />
        <Group.help>
          The title that will be used for the social media page for you to copy and paste to your
          social media accounts. If left blank, the normal title will be used.
        </Group.help>
      </Form.group>

      <Form.group data-test-id="image" @model={{this.form}} @property="image" as |Group|>
        <Group.label>Image</Group.label>
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
              <img src={{this.imageUrl}} alt="Special" class="w-full block" />
            </div>
          {{/if}}
        </div>
      </Form.group>

      <Form.group
        data-test-id="description"
        @model={{this.form}}
        @property="description"
        as |Group|
      >
        <Group.label>Description</Group.label>
        <Group.textarea
          @value={{this.form.values.description}}
          @onChange={{this.form.setter "description"}}
        />
      </Form.group>

      <Form.group data-test-id="in-stock" @model={{this.form}} @property="inStock" as |Group|>
        <Group.checkbox @checked={{this.form.values.inStock}} @onChange={{this.updateInStock}}>
          In Stock?
        </Group.checkbox>
        <Group.help>
          Only "in stock" items will appear on the main Grab &amp; Go page.
        </Group.help>
      </Form.group>

      <Form.group data-test-id="is-holiday" @model={{this.form}} @property="isHoliday" as |Group|>
        <Group.checkbox @checked={{this.form.values.isHoliday}} @onChange={{this.updateIsHoliday}}>
          Is Holiday?
        </Group.checkbox>
        <Group.help>
          When checked, this item will show in a new section on the main Grab &amp; Go page titled
          "Holiday Grab &amp; Go Items".
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
