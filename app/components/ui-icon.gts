import Component from '@glimmer/component';
import FaIcon from '@fortawesome/ember-fontawesome/components/fa-icon';
import type {
  IconDefinition,
  IconLookup,
  IconName,
  IconPrefix,
  SizeProp,
} from '@fortawesome/fontawesome-svg-core';

export type IconVariant = 'inherit' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface UiIconSignature {
  Element: HTMLSpanElement;
  Args: {
    disabled?: boolean;
    icon: IconName | IconLookup | IconDefinition;
    iconPrefix?: IconPrefix;
    size?: SizeProp;
    spin?: boolean;
    variant?: IconVariant;
  };
}

export default class UiIconComponent extends Component<UiIconSignature> {
  get iconPrefix() {
    return this.args.iconPrefix ?? 'fas';
  }

  get variant() {
    return this.args.variant ?? 'inherit';
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

  <template>
    <span data-test-id='icon' class={{this.color}} ...attributes>
      <FaIcon @icon={{@icon}} @prefix={{this.iconPrefix}} @size={{@size}} @spin={{@spin}} />
    </span>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UiIcon: typeof UiIconComponent;
  }
}
