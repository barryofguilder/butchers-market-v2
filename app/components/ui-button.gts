import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { isPresent } from '@ember/utils';
import { on } from '@ember/modifier';
import { restartableTask } from 'ember-concurrency';
import { or } from 'ember-truth-helpers';
import type {
  IconDefinition,
  IconLookup,
  IconName,
  IconPrefix,
} from '@fortawesome/fontawesome-svg-core';
import UiBaseLink, { type UiBaseLinkArgs } from './ui-base-link';
import UiIcon, { type IconVariant } from './ui-icon';

export type ButtonVariant = 'primary' | 'secondary' | 'plain';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface UiButtonArgs extends UiBaseLinkArgs {
  'data-test-id'?: string;
  disabled?: boolean;
  icon?: IconName | IconLookup | IconDefinition;
  iconPrefix?: IconPrefix;
  iconOnly?: boolean;
  isRunning?: boolean;
  onClick?: (event: Event) => unknown;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
}

export interface UiButtonSignature {
  Element: HTMLButtonElement | HTMLAnchorElement;
  Args: UiButtonArgs;
  Blocks: {
    default: [];
  };
}

// The link and button classes have to be split out since links don't support
// the `enabled` helper.
const baseClasses =
  'inline-block whitespace-nowrap transition-colors focus:outline-hidden focus:ring-3 focus:ring-blue-500';
const baseButtonClasses = 'disabled:opacity-50 disabled:cursor-not-allowed';
const baseLinkClasses = '';
const variantBaseClasses: Record<ButtonVariant, string> = {
  primary: 'bg-red-900 text-white',
  secondary: 'bg-gray-800 text-white',
  plain: 'bg-transparent border border-gray-300',
};
const variantButtonClasses: Record<ButtonVariant, string> = {
  primary: 'enabled:hover:bg-red-950',
  secondary: 'enabled:hover:bg-gray-900',
  plain: 'enabled:hover:bg-gray-300 enabled:hover:border-transparent',
};
const variantLinkClasses: Record<ButtonVariant, string> = {
  primary: 'hover:bg-red-950',
  secondary: 'hover:bg-gray-900',
  plain: 'hover:bg-gray-300 hover:border-transparent',
};
const sizeClasses: Record<ButtonSize, string> = {
  large: 'px-6 py-3 uppercase tracking-wider font-bold sm:text-xl',
  small: 'px-2 py-1 font-semibold text-xs',
  medium: 'px-4 py-2 font-semibold text-sm',
};

export default class UiButtonComponent extends Component<UiButtonSignature> {
  @tracked isRunning = false;

  // Specifying these two component properties instead of using HTML attributes is to get around
  // the limitation where using the `component` helper can only pass component properties through.
  // See: https://github.com/emberjs/rfcs/issues/497
  get 'data-test-id'() {
    return this.args['data-test-id'] ?? 'button';
  }

  get type() {
    return this.args.type ?? 'button';
  }

  get renderAsLink() {
    if (this.args.disabled) {
      // If the button is disabled, don't render as a link. This is because there's no good way to
      // disable an anchor tag (and you really shouldn't), so this will force it to render as a
      // button.
      return false;
    }

    return isPresent(this.args.href) || isPresent(this.args.route);
  }

  get baseClasses() {
    return this.renderAsLink
      ? `${baseClasses} ${baseLinkClasses}`
      : `${baseClasses} ${baseButtonClasses}`;
  }

  get variant() {
    return this.args.variant ?? 'secondary';
  }

  get variantClasses() {
    return this.renderAsLink
      ? `${variantBaseClasses[this.variant]} ${variantLinkClasses[this.variant]}`
      : `${variantBaseClasses[this.variant]} ${variantButtonClasses[this.variant]}`;
  }

  get size() {
    return this.args.size ?? 'large';
  }

  get sizeClasses() {
    return sizeClasses[this.size];
  }

  get iconOnlyClasses() {
    const baseClasses =
      'inline-block leading-tight text-center bg-transparent focus:ring-3 focus:ring-blue-500 focus:outline-hidden';
    const sizeClasses = 'p-2';
    const fontClasses = 'text-sm font-semibold';
    const disabledClasses = this.buttonDisabled ? 'opacity-50 cursor-not-allowed' : '';
    const hoverClass = `${!this.buttonDisabled ? `hover:opacity-75` : ''}`;

    return `${baseClasses} ${disabledClasses} ${sizeClasses} ${fontClasses} ${hoverClass}`;
  }

  get buttonClasses() {
    return this.args.iconOnly
      ? this.iconOnlyClasses
      : `${this.baseClasses} ${this.variantClasses} ${this.sizeClasses}`;
  }

  get buttonDisabled() {
    return (
      this.buttonTask.isRunning ||
      this.args.isRunning === true ||
      this.isRunning === true ||
      this.args.disabled === true
    );
  }

  get iconVariant() {
    const { iconOnly, variant } = this.args;

    let iconVariant: IconVariant = 'inherit';

    // Only use the `variant` property if it was passed in
    if (iconOnly && variant) {
      iconVariant = variant === 'plain' ? 'inherit' : variant;
    }

    return iconVariant;
  }

  buttonTask = restartableTask(async (event: MouseEvent) => {
    let result: ReturnType<NonNullable<UiButtonArgs['onClick']>>;

    if (this.args.onClick) {
      result = this.args.onClick(event);
    }

    if (result) {
      this.isRunning = true;
      // Wrap this in a Promise because it might just be a regular function and
      // you shouldn't await regular functions.
      await Promise.resolve(result);
    }

    this.isRunning = false;
  });

  <template>
    {{#if this.renderAsLink}}
      <UiBaseLink
        data-test-id={{this.data-test-id}}
        class={{this.buttonClasses}}
        @download={{@download}}
        @href={{@href}}
        @route={{@route}}
        @model={{@model}}
        @models={{@models}}
        @query={{@query}}
        ...attributes
      >
        {{#if @icon}}
          <UiIcon
            data-test-id='button-icon'
            @icon={{@icon}}
            @iconPrefix={{@iconPrefix}}
            @variant={{if @iconOnly this.iconVariant 'inherit'}}
          />
        {{/if}}

        {{yield}}
      </UiBaseLink>
    {{else}}
      <button
        data-test-id={{this.data-test-id}}
        class={{this.buttonClasses}}
        type={{this.type}}
        disabled={{this.buttonDisabled}}
        {{on 'click' this.buttonTask.perform}}
        ...attributes
      >
        {{#if (or this.isRunning @isRunning)}}
          <UiIcon data-test-id='is-running' @spin={{true}} @icon='circle-notch' />
        {{/if}}

        {{#if @icon}}
          <UiIcon
            data-test-id='button-icon'
            @icon={{@icon}}
            @iconPrefix={{@iconPrefix}}
            @variant={{if @iconOnly this.iconVariant 'inherit'}}
          />
        {{/if}}

        {{yield}}
      </button>
    {{/if}}
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UiButton: typeof UiButtonComponent;
  }
}
