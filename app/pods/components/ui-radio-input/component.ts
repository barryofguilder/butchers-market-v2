import Component from '@glimmer/component';
import { action } from '@ember/object';
import { once } from '@ember/runloop';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';

export interface UiRadioInputSignature {
  Args: {
    checked?: boolean;
    disabled?: boolean;
    groupValue: string;
    name: string;
    onChange: (value: string) => void;
    value: string;
  };
}

export default class UiRadioInputComponent extends Component<UiRadioInputSignature> {
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
}
