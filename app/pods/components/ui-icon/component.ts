import Component from '@glimmer/component';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';

export interface UiIconSignature {
  Args: {
    disabled?: boolean;
    iconPrefix?: 'fas' | 'far' | 'fab';
    size?: '2xs' | 'xs' | 'sm' | 'lg' | 'xl' | '2xl';
    spin?: boolean;
    variant?: 'inherit' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  };
}

export default class UiIconComponent extends Component<UiIconSignature> {
  get iconPrefix() {
    return valueOrDefault(this.args.iconPrefix, 'fas');
  }

  get variant() {
    return valueOrDefault(this.args.variant, 'inherit');
  }

  get color() {
    if (this.args.disabled) {
      return null;
    }

    switch (this.variant) {
      case 'primary':
        return 'text-blue-600';
      case 'secondary':
        return 'text-gray-700';
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-600';
      case 'danger':
        return 'text-red-600';
      default:
        return null;
    }
  }
}
