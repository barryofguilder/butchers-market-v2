import { tracked } from '@glimmer/tracking';
import { getOwner } from '@ember/owner';
import { waitForPromise } from '@ember/test-waiters';
import type { UploadFile } from 'ember-file-upload';
import type SessionService from '../services/session';
import baseUrl from './base-url';
import { getErrorMessageFromException, isUnauthorized } from './error-handling';
import { generateFileName, generatePdfFileName } from './file-name';
import type FormState from './form-state';

/**
 * What a file field (`Group.image`, `Group.pdf`) needs to show and change the selected file.
 */
export interface UploadField {
  readonly url: string | null;
  readonly hasFile: boolean;
  readonly errorMessage: string | null;
  select: (file: UploadFile) => Promise<void>;
  remove: () => void;
}

interface FileUploadOptions<Model> {
  /**
   * The field that stores the uploaded file's name, such as `imageUrl`.
   */
  field: keyof Model & string;
  /**
   * The derived field with the URL to show the saved file, such as `imageUrlPath`.
   */
  pathField: keyof Model & string;
  /**
   * Names the file the API stores.
   */
  generateFileName: (file: UploadFile) => string;
}

/**
 * Holds the file picked in an admin form until it is saved, and uploads it to the API. Use
 * `ImageUpload` or `PdfUpload`, which set the fields for each kind of file.
 *
 * Picking a file sets the form's field to a preview, so a required field passes validation. Call
 * `upload` before submitting the form: it replaces the preview with the uploaded file's name.
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
export class FileUpload<Model extends object> implements UploadField {
  @tracked private file: UploadFile | null = null;
  @tracked private previewUrl: string | null = null;
  @tracked errorMessage: string | null = null;

  private readonly context: object;
  private readonly form: FormState<Model>;
  private readonly options: FileUploadOptions<Model>;

  /**
   * @param context The component the form is in, used to look up the session for uploading.
   * @param form The form whose field this sets.
   * @param options Which fields hold the file, and how to name it.
   */
  constructor(context: object, form: FormState<Model>, options: FileUploadOptions<Model>) {
    this.context = context;
    this.form = form;
    this.options = options;
  }

  /**
   * The URL to show: the picked file's preview, or the saved file.
   */
  get url() {
    return this.previewUrl ?? (this.form.get(this.options.pathField) as string | null);
  }

  get hasFile() {
    return Boolean(this.previewUrl || this.form.get(this.options.field));
  }

  select = async (file: UploadFile) => {
    this.errorMessage = null;

    try {
      // Reading the file isn't tracked by ember-file-upload, so tests wait for it here.
      const url = (await waitForPromise(file.readAsDataURL())) as string;
      this.previewUrl = url;
      this.file = file;
      this.setField(url);
    } catch {
      this.errorMessage = 'Could not read the file contents';
    }
  };

  remove = () => {
    this.file = null;
    this.previewUrl = null;
    this.errorMessage = null;
    this.setField(null);
  };

  /**
   * Uploads the picked file, if there is one, and sets the form's field to its file name.
   *
   * @returns Returns `false` when the upload fails, after showing the API's error by the field.
   * An expired session (401) is thrown instead, so the form can send the user to sign in.
   */
  async upload() {
    this.errorMessage = null;

    if (!this.file) {
      return true;
    }

    const generatedFileName = this.options.generateFileName(this.file);
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

    this.setField(generatedFileName);
    return true;
  }

  private setField(value: string | null) {
    this.form.set(this.options.field, value as Model[keyof Model & string]);
  }
}

/**
 * An image for a model with `imageUrl` and `imageUrlPath` fields.
 */
export class ImageUpload<
  Model extends { imageUrl: string | null; readonly imageUrlPath: string | null },
> extends FileUpload<Model> {
  constructor(context: object, form: FormState<Model>) {
    super(context, form, { field: 'imageUrl', pathField: 'imageUrlPath', generateFileName });
  }
}

/**
 * A PDF for a model with `fileUrl` and `fileUrlPath` fields. The stored name keeps the original
 * file name, with the date added.
 */
export class PdfUpload<
  Model extends { fileUrl: string | null; readonly fileUrlPath: string | null },
> extends FileUpload<Model> {
  constructor(context: object, form: FormState<Model>) {
    super(context, form, {
      field: 'fileUrl',
      pathField: 'fileUrlPath',
      generateFileName: generatePdfFileName,
    });
  }
}
