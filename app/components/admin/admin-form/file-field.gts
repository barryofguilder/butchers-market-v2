import type { TOC } from '@ember/component/template-only';
import { concat } from '@ember/helper';
import { on } from '@ember/modifier';
import fileQueue from 'ember-file-upload/helpers/file-queue';
import type { UploadField } from '../../../utils/file-upload';

export interface FileFieldSignature {
  Args: {
    /**
     * The id for the file input, so the group's label points at it.
     */
    id: string;
    /**
     * The selected file, usually an `ImageUpload` or `PdfUpload`.
     */
    upload: UploadField;
    /**
     * The file types the picker allows, for the input's `accept` attribute.
     */
    accept: string;
    /**
     * What the buttons call the file, such as "Image" in "Select Image".
     */
    noun: string;
  };
  Blocks: {
    /**
     * The help text next to the buttons.
     */
    help: [];
    /**
     * Shows the file, given its URL. Only rendered when there is a file.
     */
    preview: [url: string | null];
  };
}

const buttonClass =
  'inline-block px-4 py-2 text-sm border cursor-pointer hover:bg-gray-200 focus:outline-hidden focus:ring-3 focus:ring-blue-500';

/**
 * The buttons, help text, upload error, and preview shared by `Group.image` and `Group.pdf`.
 */
const FileField: TOC<FileFieldSignature> = <template>
  <div class="mt-2">
    {{#let (fileQueue name="files" onFileAdded=@upload.select) as |queue|}}
      <label for={{@id}}>
        <span class={{buttonClass}}>{{concat "Select " @noun}}</span>
        <input type="file" id={{@id}} accept={{@accept}} hidden {{queue.selectFile}} />
      </label>
    {{/let}}

    {{#if @upload.hasFile}}
      <button type="button" class="ml-2 {{buttonClass}}" {{on "click" @upload.remove}}>
        {{concat "Remove " @noun}}
      </button>
    {{/if}}

    <small class="block mt-3 text-gray-700 sm:inline-block sm:mt-0 sm:ml-2">
      {{yield to="help"}}
    </small>

    {{#if @upload.errorMessage}}
      <span data-test-id="file-error" class="block mt-2 text-red-600">
        {{@upload.errorMessage}}
      </span>
    {{/if}}

    {{#if @upload.hasFile}}
      <div class="mt-4">
        {{yield @upload.url to="preview"}}
      </div>
    {{/if}}
  </div>
</template>;

export default FileField;
