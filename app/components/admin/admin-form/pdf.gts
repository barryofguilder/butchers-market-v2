import type { TOC } from '@ember/component/template-only';
import type { UploadField } from '../../../utils/file-upload';
import FileField from './file-field';

export interface PdfSignature {
  Args: {
    /**
     * The id for the file input, so the group's label points at it.
     */
    id: string;
    /**
     * The selected PDF, usually a `PdfUpload`.
     */
    pdf: UploadField;
    /**
     * Title for the preview frame.
     */
    title: string;
  };
}

const Pdf: TOC<PdfSignature> = <template>
  <FileField @id={{@id}} @upload={{@pdf}} @accept="application/pdf,.pdf" @noun="PDF">
    <:help>Only PDF files are allowed.</:help>
    <:preview as |url|>
      <iframe src={{url}} title={{@title}} height="600px" class="w-full"></iframe>
    </:preview>
  </FileField>
</template>;

export default Pdf;
