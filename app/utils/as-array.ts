/* eslint-disable ember/no-get */
/**
 * This file is copied directly from ember-composable-helpers.
 *
 * See: https://github.com/DockYard/ember-composable-helpers
 */
import { isArray } from '@ember/array';
import EmberObject, { get } from '@ember/object';

interface Arrayable {
  toArray(): unknown[];
}

function isIterable(value: unknown): value is Iterable<unknown> {
  return Symbol.iterator in Object(value);
}

// from https://github.com/flexyford/ember-power-select/blob/78a5430c1ac89daf315d0801fd5201e444e82434/addon/components/power-select.ts
function isArrayable(thing: object): thing is Arrayable {
  return typeof (thing as Partial<Arrayable>).toArray === 'function';
}

function isPromiseLike(thing: object): thing is PromiseLike<unknown> {
  return typeof (thing as Partial<PromiseLike<unknown>>).then === 'function';
}

function isPromiseProxyLike(thing: object): thing is PromiseLike<unknown> & { content: unknown } {
  return isPromiseLike(thing) && Object.hasOwnProperty.call(thing, 'content');
}

function toExtendable(array: unknown[]) {
  if (!Object.isExtensible(array)) {
    return Array.from(array);
  } else {
    return array;
  }
}

export default function asArray(maybeArray: unknown): unknown[] {
  return toExtendable(_asArray(maybeArray));
}

function _asArray(maybeArray: unknown): unknown[] {
  if (typeof maybeArray === 'number') {
    throw new Error('Numbers not supported as arrays [ember-composable-helpers]');
  }
  if (typeof maybeArray === 'string') {
    return maybeArray.split('');
  }
  // for perf-reasons falling back to e-array, instead of using it first
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  } else if (isArray(maybeArray)) {
    return maybeArray as unknown[];
  } else if (typeof maybeArray === 'object' && maybeArray === null) {
    return [];
  } else if (typeof maybeArray === 'undefined') {
    return [];
  } else if (maybeArray instanceof Set) {
    return Array.from(maybeArray.values());
  } else if (maybeArray instanceof Map) {
    return Array.from(maybeArray.values());
  } else if (maybeArray instanceof WeakMap) {
    throw new Error('WeakMaps is not supported as arrays [ember-composable-helpers]');
  } else if (maybeArray instanceof WeakSet) {
    throw new Error('WeakSets is not supported as arrays [ember-composable-helpers]');
  }
  if (typeof maybeArray === 'object') {
    if (isPromiseProxyLike(maybeArray)) {
      const content = get(maybeArray, 'content');
      if (typeof content !== 'object' || content === null) {
        throw new Error('Unknown content type in array-like object [ember-composable-helpers]');
      }
      if (isArrayable(content)) {
        return content.toArray();
      } else {
        return _asArray(content);
      }
    }
    if (isPromiseLike(maybeArray)) {
      throw new Error('Promise-like objects is not supported as arrays [ember-composable-helpers]');
    }
    if (isArrayable(maybeArray)) {
      return maybeArray.toArray();
    }
    if (maybeArray instanceof EmberObject) {
      throw new Error('EmberObjects is not supported as arrays [ember-composable-helpers]');
    }
    return Array.from(Object.values(maybeArray));
  }
  if (!maybeArray) {
    return [];
  }
  if (!isIterable(maybeArray)) {
    throw new Error('Argument, passed as array is not iterable [ember-composable-helpers]');
  }
  return Array.from(maybeArray);
}
