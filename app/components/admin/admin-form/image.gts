import type { TOC } from '@ember/component/template-only';
import type { UploadField } from '../../../utils/file-upload';
import FileField from './file-field';

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
    image: UploadField;
    /**
     * Alt text for the preview.
     */
    alt: string;
  };
}

const Image: TOC<ImageSignature> = <template>
  <FileField @id={{@id}} @upload={{@image}} @accept={{ACCEPT}} @noun="Image">
    <:help>Only JPG, JPEG, PNG, WebP, and AVIF files are allowed.</:help>
    <:preview as |url|>
      <img src={{url}} alt={{@alt}} class="w-full block" />
    </:preview>
  </FileField>
</template>;

export default Image;
