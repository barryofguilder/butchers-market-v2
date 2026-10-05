import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { valueOrDefault } from '../utils/value-or-default';

export interface UiRadioInputSignature<Value extends string = string> {
  Element: HTMLInputElement;
  Args: {
    checked?: boolean;
    disabled?: boolean;
    groupValue: Value;
    name: string;
    onChange: (value: Value) => void;
    value: Value;
  };
}

export default class UiRadioInput<Value extends string = string> extends Component<
  UiRadioInputSignature<Value>
> {
  get disabled() {
    return valueOrDefault(this.args.disabled, false);
  }

  get isChecked() {
    if (this.args.checked !== undefined) {
      return this.args.checked;
    }

    return this.args.groupValue === this.args.value;
  }

  get isCheckedStr() {
    return this.isChecked.toString();
  }

  @action
  handleChange() {
    this.args.onChange(this.args.value);
  }

  <template>
    <input
      data-test-id="radio-input"
      ...attributes
      type="radio"
      aria-checked={{this.isCheckedStr}}
      checked={{this.isChecked}}
      disabled={{@disabled}}
      name={{@name}}
      value={{@value}}
      {{on "change" this.handleChange}}
    />
  </template>
}
