/**
 * Uses the `value` unless it's `undefined`, then uses the `defaultValue`.
 * @param {*} value The value to try and use.
 * @param {*} defaultValue The default value to use if `value` is `undefined`.
 */
export function valueOrDefault<T, A>(value: T, defaultValue: A): T | A {
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}
