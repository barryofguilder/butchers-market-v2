import { helper } from '@ember/component/helper';

// Splits an array up into the specified number of chunks.
export function splitIn<T>([chunksOf, array]: [number, T[]]) {
  if (array === undefined || array.length === 0 || chunksOf === 1) {
    return array;
  }

  const chunkedArray = [];
  const chunks = Math.ceil(array.length / chunksOf);

  for (let i = 0; i < chunksOf; i++) {
    chunkedArray.push(array.slice(i * chunks, i * chunks + chunks));
  }

  return chunkedArray;
}

export default helper(splitIn);
