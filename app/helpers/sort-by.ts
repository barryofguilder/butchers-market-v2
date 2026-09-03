/**
 * This file is adapted from ember-composable-helpers.
 *
 * See: https://github.com/DockYard/ember-composable-helpers
 */
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import asArray from '../utils/as-array';

type Comparator<T> = (a: T, b: T) => number;
type SortKey<T> = string | Comparator<T>;

const collator = new Intl.Collator(undefined, {
  sensitivity: 'base',
});

function normalizeToBoolean(val: unknown) {
  if (typeof val === 'boolean') {
    return val;
  }

  if (typeof val === 'number') {
    if (val > 0) {
      return false;
    } else if (val < 0) {
      return true;
    }
  }

  return val;
}

function safeValueForKey(ctx: unknown, key: string) {
  if (ctx === null || ctx === undefined) {
    return ctx;
  }
  return get(ctx, key);
}

function isLowerCaseable(value: unknown): value is string {
  return typeof (value as string | undefined)?.toLowerCase === 'function';
}

function sortDesc(key: string, a: unknown, b: unknown) {
  if (isEmpty(key)) {
    return 0;
  }

  const aValue = safeValueForKey(a, key);
  const bValue = safeValueForKey(b, key);

  const isANullable = typeof aValue == 'undefined' || aValue === null;
  const isBNullable = typeof bValue == 'undefined' || bValue === null;

  if (isANullable && isBNullable) {
    //both values are nullable
    return 0;
  }

  if (isBNullable) {
    // keep bValue last
    return -1;
  }
  if (isANullable) {
    // put aValue last
    return 1;
  }

  if (isLowerCaseable(aValue) && isLowerCaseable(bValue)) {
    return collator.compare(bValue, aValue);
  }

  if (aValue < bValue) {
    return 1;
  } else if (aValue > bValue) {
    return -1;
  }

  return 0;
}

function sortAsc(key: string, a: unknown, b: unknown) {
  if (isEmpty(key)) {
    return 0;
  }

  const aValue = safeValueForKey(a, key);
  const bValue = safeValueForKey(b, key);

  const isANullable = typeof aValue == 'undefined' || aValue === null;
  const isBNullable = typeof bValue == 'undefined' || bValue === null;

  if (isANullable && isBNullable) {
    //both values are nullable
    return 0;
  }

  if (isBNullable) {
    // keep bValue last
    return -1;
  }
  if (isANullable) {
    // put aValue last
    return 1;
  }

  if (isLowerCaseable(aValue) && isLowerCaseable(bValue)) {
    return collator.compare(aValue, bValue);
  }

  if (aValue < bValue) {
    return -1;
  } else if (aValue > bValue) {
    return 1;
  }

  return 0;
}

class SortBy<T> {
  array: T[];

  constructor(array: T[]) {
    this.array = [...array];
  }

  comparator(key: SortKey<T>): Comparator<T> {
    return typeof key === 'function' ? key : this.defaultSort(key);
  }

  defaultSort(sortKey: string): Comparator<T> {
    let func = sortAsc;
    if (sortKey.match(':desc')) {
      func = sortDesc;
    }

    return (a, b) => func(sortKey.replace(/:desc|:asc/, ''), a, b);
  }
}

/**
 * best O(n); worst O(n^2)
 * If we feel like swapping with something more performant like QuickSort or MergeSort
 * then it should be easy
 */
class BubbleSort<T> extends SortBy<T> {
  perform(keys: SortKey<T>[] = []) {
    let swapped = false;

    const compFuncs = keys.map((key) => this.comparator(key));
    const compFunc: Comparator<T> = (a, b) => {
      for (const comp of compFuncs) {
        const result = comp(a, b);
        if (result === 0) {
          continue;
        }
        return result;
      }
      return 0;
    };

    for (let i = 1; i < this.array.length; i += 1) {
      for (let j = 0; j < this.array.length - i; j += 1) {
        const shouldSwap = normalizeToBoolean(compFunc(this.array[j + 1]!, this.array[j]!));
        if (shouldSwap) {
          [this.array[j], this.array[j + 1]] = [this.array[j + 1]!, this.array[j]!];

          swapped = true;
        }
      }

      // no need to continue sort if not swapped in any inner iteration
      if (!swapped) {
        return;
      }
    }
  }
}

/**
 * Sorts an array by one or more keys, e.g. `{{sortBy 'title' items}}` or
 * `{{sortBy 'lastName' 'firstName' people}}`. Suffix a key with `:desc` to reverse it.
 *
 * This is a plain function helper rather than a `helper()`-wrapped one so that its generic
 * parameter survives into templates. `helper()` erases it, which leaves callers iterating
 * over `unknown`.
 */
export default function sortBy<T>(keys: SortKey<T>[], array: T[] | undefined | null): T[];
export default function sortBy<T>(...params: [...SortKey<T>[], T[] | undefined | null]): T[];
export default function sortBy<T>(
  ...params: (SortKey<T> | SortKey<T>[] | T[] | undefined | null)[]
): T[] {
  // slice params to avoid mutating the provided params
  const sortParams = params.slice();
  const array = asArray(sortParams.pop()) as T[];
  let sortKeys = sortParams as SortKey<T>[];

  if (!array || sortKeys.length === 0) {
    return [];
  }

  const [firstKey] = sortKeys;
  if (sortKeys.length === 1 && Array.isArray(firstKey)) {
    sortKeys = firstKey as SortKey<T>[];
  }

  const sortKlass = new BubbleSort(array);
  sortKlass.perform(sortKeys);
  return sortKlass.array;
}
