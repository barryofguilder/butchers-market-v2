import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import type Owner from '@ember/owner';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { dropTask, enqueueTask } from 'ember-concurrency';
import type { UploadFile } from 'ember-file-upload';
import fileQueue from 'ember-file-upload/helpers/file-queue';
import type Special from '../../../models/special';
import type SessionService from '../../../services/session';
import SpecialValidations from '../../../validations/special';
import FormState from '../../../utils/form-state';
import baseUrl from '../../../utils/base-url';
import { ORDER_ONLINE_URL } from '../../../utils/config';
import { generateFileName } from '../../../utils/file-name';
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

  form: FormState<Special>;
  orderOnlineUrl = ORDER_ONLINE_URL;

  @tracked activeDuringRange = false;
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

  constructor(owner: Owner, args: SpecialFormSignature['Args']) {
    super(owner, args);

    this.form = new FormState(this.args.special, SpecialValidations);

    if (this.form.get('activeStartDate')) {
      this.activeDuringRange = true;
    }
  }

  saveSpecial = dropTask(async () => {
    this.form.validate();

    const hasImage = this.image || this.form.get('imageUrl');

    if (!this.form.isValid || !hasImage) {
      if (!hasImage) {
        this.form.addError('image', 'Image URL is required');
      }

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

      await this.form.save();
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
      this.form.removeError('image');
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
    this.form.removeError('image');

    this.form.set('imageUrl', null);
  };

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

      <Form.group data-test-id="image" @model={{this.form}} @property="image" as |Group|>
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
              <img src={{this.imageUrl}} alt="Special" class="w-full block" />
            </div>
          {{/if}}
        </div>
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
