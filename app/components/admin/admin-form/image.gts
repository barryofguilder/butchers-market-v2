import type { TOC } from '@ember/component/template-only';
import { on } from '@ember/modifier';
import fileQueue from 'ember-file-upload/helpers/file-queue';
import type { ImageField } from '../../../utils/image-upload';

/**
 * The image types the API accepts. The extensions are listed too, since some systems don't map
 * every extension (such as `.avif`) to its type.
 */
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif';

export interface ImageSignature {
  Args: {
    /**
     * The id for the file input, so the group's label points at it.
     */
    id: string;
    /**
     * The selected image, usually an `ImageUpload`.
     */
    image: ImageField;
    /**
     * Alt text for the preview.
     */
    alt: string;
  };
}

const buttonClass =
  'inline-block px-4 py-2 text-sm border cursor-pointer hover:bg-gray-200 focus:outline-hidden focus:ring-3 focus:ring-blue-500';

const Image: TOC<ImageSignature> = <template>
  <div class="mt-2">
    {{#let (fileQueue name="photos" onFileAdded=@image.select) as |queue|}}
      <label for={{@id}}>
        <span class={{buttonClass}}>
          Select Image
        </span>
        <input type="file" id={{@id}} accept={{ACCEPT}} hidden {{queue.selectFile}} />
      </label>
    {{/let}}

    {{#if @image.hasImage}}
      <button type="button" class="ml-2 {{buttonClass}}" {{on "click" @image.remove}}>
        Remove Image
      </button>
    {{/if}}

    <small class="block mt-3 text-gray-700 sm:inline-block sm:mt-0 sm:ml-2">
      Only JPG, JPEG, PNG, WebP, and AVIF files are allowed.
    </small>

    {{#if @image.errorMessage}}
      <span data-test-id="file-error" class="block mt-2 text-red-600">
        {{@image.errorMessage}}
      </span>
    {{/if}}

    {{#if @image.hasImage}}
      <div class="mt-4">
        <img src={{@image.url}} alt={{@alt}} class="w-full block" />
      </div>
    {{/if}}
  </div>
</template>;

export default Image;
