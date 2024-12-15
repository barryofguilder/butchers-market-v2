import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export interface CheckboxSignature {
  Element: HTMLLabelElement;
  Args: {
    checked: boolean;
    hideLabel?: boolean;
    onChange: (checked: boolean) => unknown;
  };
  Blocks: {
    default: [];
  };
}

export default class CheckboxComponent extends Component<CheckboxSignature> {
  @action
  handleOnChange(event: Event) {
    this.args.onChange((event.target as HTMLInputElement).checked);
  }

  <template>
    <label class='flex gap-x-2 items-center'>
      <input type='checkbox' checked={{@checked}} {{on 'change' this.handleOnChange}} />
      <span class='{{if @hideLabel "sr-only"}}'>{{yield}}</span>
    </label>
  </template>
}
