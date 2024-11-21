import { format } from 'date-fns';
import { UploadFile } from 'ember-file-upload';

/**
 * Generates a file name to store in the database for general files.
 *
 * @param {UploadFile} file
 * @return Returns the file name to store.
 */
export function generateFileName(file: UploadFile) {
  const fileParts = file.name.split('.');
  const extension = fileParts.length > 1 ? `.${fileParts[fileParts.length - 1]}` : '';
  return `${crypto.randomUUID()}${extension}`;
}

/**
 * Generates a file name to store in the database for PDF files.
 *
 * @param {UploadFile} file
 * @return Returns the file name to store.
 */
export function generatePdfFileName(file: UploadFile) {
  const fileParts = file.name.split('.');
  const extension = fileParts.length > 1 ? `.${fileParts[fileParts.length - 1]}` : '';

  // Remove the extension.
  fileParts.splice(fileParts.length - 1, 1);

  const dateStamp = format(new Date(), 'yyyyMMdd');
  return `${fileParts.join('.')}_${dateStamp}${extension}`;
}
