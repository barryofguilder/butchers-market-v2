import Component from '@glimmer/component';
import { eq } from 'ember-truth-helpers';
import { valueOrDefault } from '../utils/value-or-default';

export interface UiAlertSignature {
  Element: HTMLDivElement;
  Args: {
    variant: 'primary' | 'success' | 'warning' | 'danger';
  };
  Blocks: {
    default: [];
  };
}

export default class UiAlertComponent extends Component<UiAlertSignature> {
  get variant() {
    return valueOrDefault(this.args.variant, 'primary');
  }

  <template>
    <div
      data-test-id='alert'
      class='mb-4 p-4 rounded
        {{if (eq this.variant "primary") "bg-blue-200 text-blue-900"}}
        {{if (eq this.variant "success") "bg-green-200 text-green-900"}}
        {{if (eq this.variant "warning") "bg-yellow-200 text-yellow-900"}}
        {{if (eq this.variant "danger") "bg-red-200 text-red-900"}}
        '
      role='alert'
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
