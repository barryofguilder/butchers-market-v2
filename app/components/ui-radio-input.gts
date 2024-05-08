import Component from '@glimmer/component';
import type { EmptyObject } from '@ember/component/helper';
import { action } from '@ember/object';
import { once } from '@ember/runloop';
import { on } from '@ember/modifier';
import { valueOrDefault } from '../utils/value-or-default';

export interface UiRadioInputSignature {
  Element: HTMLInputElement;
  Args: {
    checked?: boolean;
    disabled?: boolean;
    groupValue: string;
    name: string;
    onChange: (value: string) => void;
    value: string;
  };
  Blocks: EmptyObject;
}

export default class UiRadioInput extends Component<UiRadioInputSignature> {
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
    if (this.args.groupValue !== this.args.value) {
      once(this.args, 'onChange', this.args.value);
    }
  }

  <template>
    <input
      data-test-id='radio-input'
      ...attributes
      type='radio'
      aria-checked={{this.isCheckedStr}}
      checked={{this.isChecked}}
      disabled={{@disabled}}
      name={{@name}}
      value={{@value}}
      {{on 'change' this.handleChange}}
    />
  </template>
}
