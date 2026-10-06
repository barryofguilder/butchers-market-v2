import { findAll } from '@ember/test-helpers';
import { testId } from './test-id';

/**
 * The text of one column in each row with the given `data-test-id`, in display order.
 */
export function columnText(rowTestId: string, column: number) {
  return findAll(testId(rowTestId)).map((row) =>
    row.querySelectorAll('td')[column]!.textContent.trim()
  );
}

/**
 * The row with the given `data-test-id` that contains `text`. Throws when there isn't one, so a
 * missing row fails the test with a clear message.
 */
export function rowWith(rowTestId: string, text: string) {
  const row = findAll(testId(rowTestId)).find((row) => row.textContent.includes(text));

  if (!row) {
    throw new Error(`No ${rowTestId} row containing "${text}"`);
  }

  return row as HTMLElement;
}

/**
 * The button whose text is `text`, such as a form's "Cancel" or a modal's "Yes".
 */
export function buttonWithText(text: string) {
  const button = findAll('button').find((button) => button.textContent.trim() === text);

  if (!button) {
    throw new Error(`No button with the text "${text}"`);
  }

  return button;
}
