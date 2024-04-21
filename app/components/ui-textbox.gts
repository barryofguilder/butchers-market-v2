import Component from '@glimmer/component';
import type { EmptyObject } from '@ember/component/helper';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { guidFor } from '@ember/object/internals';
import { valueOrDefault } from '../utils/value-or-default';

export interface UiTextboxSignature {
  Element: HTMLInputElement;
  Args: {
    id?: string;
    value: string;
    readonly?: boolean;
    hasErrors?: boolean;
    // TODO: Is this correct?
    errors?: string[];
    onChange: (value: string) => void;
  };
  Blocks: EmptyObject;
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

  get onChange() {
    return valueOrDefault(this.args.onChange, () => {
      //
    });
  }

  get readonly() {
    return valueOrDefault(this.args.readonly, false);
  }

  @action
  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  <template>
    <input
      data-test-id='textbox'
      type='text'
      class='styled-textbox {{if this.hasErrors "has-errors"}}'
      id={{this.id}}
      value={{@value}}
      readonly={{this.readonly}}
      ...attributes
      {{on 'input' this.handleInput}}
    />
  </template>
}
