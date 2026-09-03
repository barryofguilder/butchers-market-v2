/**
 * Splits an array up into the specified number of chunks, e.g. `{{splitIn 2 items}}`.
 *
 * This is a plain function helper rather than a `helper()`-wrapped one so that its generic
 * parameter survives into templates. `helper()` erases it, which leaves callers iterating
 * over `unknown`.
 */
export default function splitIn<T>(chunksOf: number, array: T[]): T[][] {
  if (array === undefined || array.length === 0) {
    return [];
  }

  if (chunksOf === 1) {
    return [array];
  }

  const chunkedArray: T[][] = [];
  const chunks = Math.ceil(array.length / chunksOf);

  for (let i = 0; i < chunksOf; i++) {
    chunkedArray.push(array.slice(i * chunks, i * chunks + chunks));
  }

  return chunkedArray;
}
