import Component from '@glimmer/component';
import type { EmptyObject } from '@ember/component/helper';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { guidFor } from '@ember/object/internals';
import { valueOrDefault } from '../utils/value-or-default';

export interface UiTextareaSignature {
  Element: HTMLTextAreaElement;
  Args: {
    id?: string;
    hasErrors?: boolean;
    // TODO: Is this correct?
    errors?: string[];
    onChange?: (value: string) => void;
    readonly?: boolean;
    value: string;
  };
  Blocks: EmptyObject;
}

export default class UiTextareaComponent extends Component<UiTextareaSignature> {
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
    const value = (event.target as HTMLTextAreaElement).value;
    this.onChange?.(value);
  }

  <template>
    <textarea
      data-test-id='textarea'
      id={{this.id}}
      class='styled-textbox {{if this.hasErrors "has-errors"}}'
      value={{@value}}
      readonly={{this.readonly}}
      ...attributes
      {{on 'input' this.handleInput}}
    >
    </textarea>
  </template>
}
