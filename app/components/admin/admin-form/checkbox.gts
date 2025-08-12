import Component from '@glimmer/component';
import { action } from '@ember/object';
import { on } from '@ember/modifier';

export interface CheckboxSignature {
  Element: HTMLLabelElement;
  Args: {
    checked: boolean;
    hideLabel?: boolean;
    onChange: (checked: boolean) => unknown;
    readonly?: boolean;
  };
  Blocks: {
    default: [];
  };
}

export default class CheckboxComponent extends Component<CheckboxSignature> {
  get readonly() {
    return this.args.readonly ?? false;
  }

  @action
  handleOnChange(event: Event) {
    this.args.onChange((event.target as HTMLInputElement).checked);
  }

  <template>
    <label class='flex gap-x-2 items-center'>
      <input
        type='checkbox'
        checked={{@checked}}
        readonly={{this.readonly}}
        {{on 'change' this.handleOnChange}}
      />
      <span class='{{if @hideLabel "sr-only"}}'>{{yield}}</span>
    </label>
  </template>
}
