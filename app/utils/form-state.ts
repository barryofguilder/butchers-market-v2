import { tracked } from '@glimmer/tracking';
import type { Validations } from './validators';

export interface FieldError {
  key: string;
  validation: string[];
  value: unknown;
}

interface Saveable {
  save(): Promise<unknown>;
}

/**
 * Sends the model to the API. Forms for resources that have moved to WarpDrive schemas pass one
 * built on `saveRecord`, since their records have no `save` method.
 */
export type Persist<Model> = (model: Model) => Promise<unknown>;

type Key<Model> = keyof Model & string;

/**
 * Holds unsaved edits to a model while a form is open. Edits only reach the model when `save` is
 * called, so cancelling a form leaves the model untouched.
 *
 * Each field is validated as soon as it is set, and `validate` checks every field that has
 * validations, so errors show up while typing and again on submit.
 *
 * ```js
 * form = new FormState(this.args.item, ItemValidations);
 * form = new FormState(this.args.special, SpecialValidations, (special) =>
 *   saveRecord(this.store, special)
 * );
 * ```
 *
 * ```hbs
 * <Form.group @model={{this.form}} @property="title" as |Group|>
 *   <Group.textbox @value={{this.form.values.title}} @onChange={{this.form.setter "title"}} />
 * </Form.group>
 * ```
 */
export default class FormState<Model extends object> {
  @tracked private changes: Partial<Model> = {};
  @tracked private errorMap: Record<string, FieldError> = {};

  private readonly model: Model;
  private readonly validations: Validations;
  private readonly persist: Persist<Model>;

  /**
   * The model's values with any unsaved edits on top. Reads go through `get`, so templates can
   * use `this.form.values.title` and re-render when the field changes.
   */
  readonly values: Readonly<Model>;

  constructor(model: Model, validations: Validations = {}, persist?: Persist<Model>) {
    this.model = model;
    this.validations = validations;
    this.persist = persist ?? ((model) => (model as Model & Saveable).save());
    this.values = new Proxy({} as Model, {
      get: (_target, key) => (typeof key === 'string' ? this.get(key as Key<Model>) : undefined),
      // Glimmer falls back to `unknownProperty` for keys that read as `undefined` and aren't `in`
      // the object, and WarpDrive records throw on unknown fields.
      has: (_target, key) => key in this.changes || key in this.model,
    });
  }

  get errors(): FieldError[] {
    return Object.values(this.errorMap);
  }

  get isValid() {
    return this.errors.length === 0;
  }

  get isInvalid() {
    return !this.isValid;
  }

  get<K extends Key<Model>>(key: K): Model[K] {
    return key in this.changes ? (this.changes[key] as Model[K]) : this.model[key];
  }

  /**
   * Records an edit and validates that field.
   */
  set<K extends Key<Model>>(key: K, value: Model[K]) {
    this.changes = { ...this.changes, [key]: value };
    this.validateKey(key);
  }

  /**
   * Returns a function that sets one field, for passing to inputs in templates, e.g.
   * `@onChange={{this.form.setter "title"}}`. Unlike `{{fn this.form.set "title"}}`, this keeps the
   * field's type, so the input's value is checked against it.
   */
  setter = <K extends Key<Model>>(key: K) => {
    return (value: Model[K]) => this.set(key, value);
  };

  /**
   * Validates every field that has validations.
   */
  validate() {
    for (const key of Object.keys(this.validations)) {
      this.validateKey(key as Key<Model>);
    }
  }

  /**
   * Adds an error the validations can't express, such as a missing upload. It stays until that
   * key is set, validated, or removed with `removeError`.
   */
  addError(key: string, message: string) {
    this.errorMap = { ...this.errorMap, [key]: { key, validation: [message], value: undefined } };
  }

  removeError(key: string) {
    if (key in this.errorMap) {
      this.errorMap = Object.fromEntries(
        Object.entries(this.errorMap).filter(([errorKey]) => errorKey !== key)
      );
    }
  }

  /**
   * Copies the edits onto the model and saves it. If the save fails the edits stay on the model,
   * so the form keeps showing them and can be submitted again.
   */
  async save() {
    Object.assign(this.model, this.changes);
    this.changes = {};

    await this.persist(this.model);

    this.errorMap = {};
  }

  private validateKey(key: Key<Model>) {
    const value = this.get(key);
    const messages = (this.validations[key] ?? [])
      .map((validator) => validator(key, value))
      .filter((result): result is string => result !== true);

    if (messages.length > 0) {
      this.errorMap = { ...this.errorMap, [key]: { key, validation: messages, value } };
    } else {
      this.removeError(key);
    }
  }
}
