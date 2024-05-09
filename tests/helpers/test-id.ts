/**
 * Creates a CSS selector using the `data-test-id` of the elements.
 *
 * @function testId
 * @param {String[]} ids The array or selector ids.
 * @return {String} A single CSS selector.
 */
export function testId(...ids: string[]): string {
  return ids
    .map((arg) => {
      if (arg[0] === '.' || arg[0] === '#') {
        return arg;
      }

      return `[data-test-id="${arg}"]`;
    })
    .join(' ');
}
