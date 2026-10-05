/**
 * Field validators for `FormState`. These replace the two validators the admin forms used from
 * `ember-changeset-validations`, and keep its behavior and messages.
 *
 * This file is adapted from ember-changeset-validations and ember-validators. The messages and
 * the way a key becomes its description are taken from them, and the presence and length rules
 * follow theirs.
 *
 * See: https://github.com/adopted-ember-addons/ember-changeset-validations
 * See: https://github.com/adopted-ember-addons/ember-validators
 */
import { isEmpty, isNone } from '@ember/utils';
import { capitalize, dasherize } from '@ember/string';

/**
 * Returns `true` when the value is valid, or the error message when it isn't.
 */
export type Validator = (key: string, value: unknown) => true | string;

export type Validations = Record<string, Validator[]>;

interface MessageOptions {
  /**
   * How the field is named in the message. Defaults to the key in sentence case, so `imageUrl`
   * becomes "Image url".
   */
  description?: string;
  /**
   * Replaces the whole message.
   */
  message?: string;
}

function describe(key: string) {
  return capitalize(dasherize(key).split(/[._-]/g).join(' '));
}

function buildMessage(key: string, options: MessageOptions, message: string) {
  return options.message ?? message.replace('{description}', options.description ?? describe(key));
}

/**
 * Fails when the value is `null`, `undefined`, an empty string, or an empty array. A string of
 * only whitespace counts as present.
 */
export function validatePresence(options: MessageOptions = {}): Validator {
  return (key, value) =>
    isEmpty(value) ? buildMessage(key, options, "{description} can't be blank") : true;
}

/**
 * Fails when the value is longer than `max`. `null` and `undefined` pass, so pair it with
 * `validatePresence` for required fields.
 */
export function validateLength(options: MessageOptions & { max: number }): Validator {
  return (key, value) => {
    if (isNone(value) || (value as { length: number }).length <= options.max) {
      return true;
    }

    return buildMessage(
      key,
      options,
      `{description} is too long (maximum is ${options.max} characters)`
    );
  };
}
