import { v4 as uuidv4 } from 'uuid';
import format from 'date-fns/format';

/**
 * Generates a file name to store in the database for general files.
 *
 * @param {*} file
 * @return Returns the file name to store.
 */
export function generateFileName(file) {
  const fileParts = file.name.split('.');
  const extension = fileParts.length > 1 ? `.${fileParts[fileParts.length - 1]}` : '';
  return `${uuidv4()}${extension}`;
}

/**
 * Generates a file name to store in the database for PDF files.
 *
 * @param {*} file
 * @return Returns the file name to store.
 */
export function generatePdfFileName(file) {
  const fileParts = file.name.split('.');
  const extension = fileParts.length > 1 ? `.${fileParts[fileParts.length - 1]}` : '';

  // Remove the extension.
  fileParts.splice(fileParts.length - 1, 1);

  const dateStamp = format(new Date(), 'yyyyMMdd');
  return `${fileParts.join('.')}_${dateStamp}${extension}`;
}
