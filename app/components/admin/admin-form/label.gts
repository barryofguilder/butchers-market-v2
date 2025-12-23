import Component from '@glimmer/component';

export interface LabelSignature {
  Element: HTMLLabelElement;
  Args: {
    for: string;
    // TODO: Is this the correct type?
    errors?: string[];
  };
  Blocks: {
    default: [];
  };
}

export default class LabelComponent extends Component<LabelSignature> {
  get hasErrors() {
    return this.args.errors && this.args.errors.length > 0;
  }

  <template>
    <label
      data-test-id='label'
      class='block mb-1 font-semibold text-sm {{if this.hasErrors "has-errors text-red-700"}}'
      for={{@for}}
      ...attributes
    >
      {{yield}}
    </label>
  </template>
}
