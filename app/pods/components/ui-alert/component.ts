import Component from '@glimmer/component';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';

export interface UiAlertSignature {
  Args: {
    variant?: 'primary' | 'success' | 'warning' | 'danger';
  };
}

export default class UiAlertComponent extends Component<UiAlertSignature> {
  get variant() {
    return valueOrDefault(this.args.variant, 'primary');
  }
}
