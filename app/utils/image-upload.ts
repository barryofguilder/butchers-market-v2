import { tracked } from '@glimmer/tracking';
import { getOwner } from '@ember/owner';
import { waitForPromise } from '@ember/test-waiters';
import type { UploadFile } from 'ember-file-upload';
import type SessionService from '../services/session';
import baseUrl from './base-url';
import { getErrorMessageFromException, isUnauthorized } from './error-handling';
import { generateFileName } from './file-name';
import type FormState from './form-state';

/**
 * The fields a model needs for `ImageUpload`: the stored file name and the derived URL to show it.
 */
export interface ImageFields {
  imageUrl: string | null;
  readonly imageUrlPath: string | null;
}

/**
 * What the image field (`Group.image`) needs to show and change the selected image.
 */
export interface ImageField {
  readonly url: string | null;
  readonly hasImage: boolean;
  readonly errorMessage: string | null;
  select: (file: UploadFile) => Promise<void>;
  remove: () => void;
}

/**
 * Holds the image picked in an admin form until it is saved, and uploads it to the API.
 *
 * Picking a file sets the form's `imageUrl` to a preview, so a required `imageUrl` passes
 * validation. Call `upload` before submitting the form: it replaces the preview with the uploaded
 * file's name.
 *
 * ```js
 * image = new ImageUpload(this, this.form);
 *
 * if (!(await this.image.upload())) {
 *   return;
 * }
 * await this.form.submit();
 * ```
 *
 * ```hbs
 * <Form.group @model={{this.form}} @property="imageUrl" as |Group|>
 *   <Group.image @image={{this.image}} @alt="Deli item" />
 * </Form.group>
 * ```
 */
export default class ImageUpload<Model extends ImageFields> implements ImageField {
  @tracked private file: UploadFile | null = null;
  @tracked private previewUrl: string | null = null;
  @tracked errorMessage: string | null = null;

  private readonly context: object;
  private readonly form: FormState<Model>;

  /**
   * @param context The component the form is in, used to look up the session for uploading.
   * @param form The form whose `imageUrl` this sets.
   */
  constructor(context: object, form: FormState<Model>) {
    this.context = context;
    this.form = form;
  }

  /**
   * The URL to show: the picked file's preview, or the saved image.
   */
  get url() {
    return this.previewUrl ?? this.form.get('imageUrlPath');
  }

  get hasImage() {
    return Boolean(this.previewUrl || this.form.get('imageUrl'));
  }

  select = async (file: UploadFile) => {
    this.errorMessage = null;

    try {
      // Reading the file isn't tracked by ember-file-upload, so tests wait for it here.
      const url = (await waitForPromise(file.readAsDataURL())) as string;
      this.previewUrl = url;
      this.file = file;
      this.setImageUrl(url);
    } catch {
      this.errorMessage = 'Could not read the file contents';
    }
  };

  remove = () => {
    this.file = null;
    this.previewUrl = null;
    this.errorMessage = null;
    this.setImageUrl(null);
  };

  /**
   * Uploads the picked file, if there is one, and sets the form's `imageUrl` to its file name.
   *
   * @returns Returns `false` when the upload fails, after showing the API's error by the field.
   * An expired session (401) is thrown instead, so the form can send the user to sign in.
   */
  async upload() {
    this.errorMessage = null;

    if (!this.file) {
      return true;
    }

    const generatedFileName = generateFileName(this.file);
    const token = (getOwner(this.context)?.lookup('service:session') as SessionService).token;

    try {
      await this.file.upload(`${baseUrl}/upload`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        data: { generatedFileName },
      });
    } catch (ex) {
      if (isUnauthorized(ex)) {
        throw ex;
      }

      this.errorMessage = await getErrorMessageFromException(ex);
      return false;
    }

    this.setImageUrl(generatedFileName);
    return true;
  }

  private setImageUrl(value: string | null) {
    this.form.set('imageUrl', value);
  }
}
