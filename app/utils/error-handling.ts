/**
 * Standard JSON:API error response.
 */
export interface JsonApiError {
  status: number;
  title: string;
  detail?: string;
}

/**
 * Extracts the error message from an exception.
 *
 * @param exception The exception to extract the error message from.
 * @param defaultMessage (Optional) The default message to return if the exception does not contain an error message.
 * @returns Returns the error message from the exception or the default message if the exception does not contain an error message.
 */
export async function getErrorMessageFromException(exception: unknown, defaultMessage?: string) {
  const _defaultMessage = defaultMessage ?? 'Something went wrong, please try again.';

  if (exception instanceof Response) {
    const json = await exception.json();
    return getFirstErrorMessage(json.errors) ?? _defaultMessage;
  }

  if (typeof exception === 'object' && exception !== null && 'errors' in exception) {
    return (
      getFirstErrorMessage((exception as { errors: JsonApiError[] }).errors) ?? _defaultMessage
    );
  }

  return _defaultMessage;
}

/**
 * Extracts the first error from a JSON:API error response.
 *
 * @param errors The JSON:API errors.
 * @returns Returns the first error in the array or null if the array is empty.
 */
export function getFirstError(errors?: JsonApiError[] | null) {
  if (errors) {
    return errors.length > 0 && errors[0] ? errors[0] : null;
  }

  return null;
}

/**
 * Extracts the first error message from a JSON:API error response. If the error has a detail, that
 * will be returns, otherwise the title will be returned.
 *
 * @param errors The JSON:API errors.
 * @returns Returns the first error message in the array or null if the array is empty.
 */
export function getFirstErrorMessage(errors?: JsonApiError[] | null) {
  const error = getFirstError(errors);

  if (error === null) {
    return null;
  }

  return error.detail ? error.detail : error.title;
}
