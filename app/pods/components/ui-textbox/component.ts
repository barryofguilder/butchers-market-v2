import Component from '@glimmer/component';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';

export interface UiTextboxSignature {
  Args: {
    hasErrors?: boolean;
    errors?: { message: string }[];
    id?: string;
    readonly?: boolean;
    onChange?: (value: string) => void;
    value?: string;
  };
}

export default class UiTextboxComponent extends Component<UiTextboxSignature> {
  get id() {
    return valueOrDefault(this.args.id, guidFor(this));
  }

  get hasErrors() {
    if (this.args.hasErrors) {
      return true;
    }

    return (this.args.errors ?? []).length > 0;
  }

  get readonly() {
    return valueOrDefault(this.args.readonly, false);
  }

  @action
  handleInput(event: InputEvent) {
    const element = event.target as HTMLInputElement;
    this.args.onChange?.(element.value);
  }
}
