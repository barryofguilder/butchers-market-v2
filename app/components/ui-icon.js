import Component from '@glimmer/component';
import { valueOrDefault } from '../utils/value-or-default';

export default class UiIconComponent extends Component {
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
