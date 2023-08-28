import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isPresent } from '@ember/utils';
import { valueOrDefault } from 'butchers-market/utils/value-or-default';
import type { Task } from 'ember-concurrency';

export interface ButtonSignature {
  Args: {
    'data-test-id'?: string;
    disabled?: boolean;
    href?: string;
    iconOnly?: boolean;
    onClick?: () => unknown;
    route?: string;
    size?: 'large' | 'medium' | 'small';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task?: Task<any, any[]>;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'plain' | 'secondary';
  };
}

export default class ButtonComponent extends Component<ButtonSignature> {
  // Specifying these two component properties instead of using HTML attributes is to get around
  // the limitation where using the `component` helper can only pass component properties through.
  // See: https://github.com/emberjs/rfcs/issues/497
  get 'data-test-id'() {
    return valueOrDefault(this.args['data-test-id'], 'button');
  }
  get type() {
    return valueOrDefault(this.args.type, 'button');
  }

  get variant() {
    return valueOrDefault(this.args.variant, 'secondary');
  }

  get disabled() {
    return valueOrDefault(this.args.disabled, false);
  }

  get size() {
    return valueOrDefault(this.args.size, 'large');
  }

  get renderAsLink() {
    if (this.disabled) {
      // If the button is disabled, don't render as a link. This is because there's no good way to
      // disable an anchor tag (and you really shouldn't), so this will force it to render as a
      // button.
      return false;
    }

    return isPresent(this.args.href) || isPresent(this.args.route);
  }

  get iconOnlyClasses() {
    const baseClasses =
      'inline-block leading-tight text-center bg-transparent focus:ring focus:outline-none';
    const sizeClasses = 'p-2';
    const fontClasses = 'text-sm font-semibold';
    const disabledClasses = this.buttonDisabled ? 'opacity-50 cursor-not-allowed' : '';
    const hoverClass = `${!this.buttonDisabled ? `hover:opacity-75` : ''}`;

    return `${baseClasses} ${disabledClasses} ${sizeClasses} ${fontClasses} ${hoverClass}`;
  }

  get buttonDisabled() {
    return (this.args.task && this.args.task.isRunning) || this.args.disabled;
  }

  get iconVariant() {
    // Only use the `variant` property if it was passed in
    return this.args.iconOnly && this.args.variant ? this.args.variant : 'inherit';
  }

  get buttonClasses() {
    if (this.args.iconOnly) {
      return this.iconOnlyClasses;
    }

    let variantClasses;

    switch (this.variant) {
      case 'primary':
        variantClasses = `bg-red-800 text-white ${this.args.disabled ? '' : 'hover:bg-red-900'}`;
        break;

      case 'plain':
        variantClasses = `bg-transparent border border-gray-300 ${
          this.args.disabled ? '' : 'hover:bg-gray-300 hover:border-transparent'
        }`;
        break;

      case 'secondary':
      default:
        variantClasses = `bg-gray-800 text-white ${this.args.disabled ? '' : 'hover:bg-gray-900'}`;
        break;
    }

    let sizeClasses;

    switch (this.size) {
      case 'large':
        sizeClasses = 'px-6 py-3 uppercase tracking-wider font-bold sm:text-xl';
        break;

      case 'small':
        sizeClasses = 'px-2 py-1 font-semibold text-xs';
        break;

      case 'medium':
      default:
        sizeClasses = 'px-4 py-2 font-semibold text-sm';
        break;
    }

    return `inline-block whitespace-nowrap ${variantClasses} ${sizeClasses} ${
      this.buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''
    } transition-form-element focus:outline-none focus:ring`;
  }

  @action
  click(event: MouseEvent) {
    if (this.args.task) {
      event.preventDefault();
      this.args.task.perform();
    } else if (this.args.onClick) {
      event.preventDefault();
      this.args.onClick();
    }
  }
}
