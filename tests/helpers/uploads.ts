import { selectFiles } from 'ember-file-upload/test-support';
import { Response } from 'miragejs';
import { testId } from './test-id';

interface MirageServer {
  post: (path: string, handler: () => Response) => void;
}

/**
 * The error the API returns for an image type it doesn't support.
 */
export const UNSUPPORTED_IMAGE_ERROR =
  "HEIC photos can't be uploaded. Please save the photo as a JPEG or PNG and try again.";

/**
 * Makes Mirage reject uploads the way the API rejects an unsupported image type.
 *
 * ```ts
 * rejectUploads(this.server);
 * ```
 */
export function rejectUploads(server: unknown) {
  (server as MirageServer).post('/upload', () => {
    return new Response(
      415,
      {},
      {
        errors: [
          { status: '415', title: 'Unsupported Media Type', detail: UNSUPPORTED_IMAGE_ERROR },
        ],
      }
    );
  });
}

/**
 * Picks a HEIC photo in the form's image field.
 */
export async function selectHeicImage() {
  await selectFiles(
    `${testId('image')} input[type="file"]`,
    new File(['image'], 'photo.heic', { type: 'image/heic' })
  );
}
