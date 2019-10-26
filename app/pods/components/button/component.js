import Component from '@ember/component';
import { computed } from '@ember/object';
import { notEmpty } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  supportsDataTestProperties: true,

  'data-test-id': 'button',
  _variant: null,
  // This is a computed property so that we can tell if the user has actually set the `variant`
  // property themselves or if it is just using the default.
  variant: computed('_variant', {
    get(/* key */) {
      if (!this._variant) {
        return 'secondary';
      }

      return this.variant;
    },
    set(key, value) {
      this.set('_variant', value);
      return value;
    },
  }),
  size: 'large',
  disabled: false,
  icon: null,
  iconPrefix: null,
  iconOnly: false,
  task: null,
  onClick: null,

  _iconOnlyClasses() {
    const baseClasses =
      'inline-block leading-tight text-center bg-transparent focus:shadow-outline focus:outline-none';
    const sizeClasses = 'p-2';
    const fontClasses = 'text-sm font-semibold';
    const disabledClasses = this.buttonDisabled ? 'opacity-50 cursor-not-allowed' : '';
    const hoverClass = `${!this.buttonDisabled ? `hover:opacity-75` : ''}`;

    return `${baseClasses} ${disabledClasses} ${sizeClasses} ${fontClasses} ${hoverClass}`;
  },

  hasIcon: notEmpty('icon'),
  buttonDisabled: computed('task.isRunning', 'disabled', function() {
    return this.get('task.isRunning') || this.disabled;
  }),
  iconOnlyVariant: computed('_variant', 'iconOnly', function() {
    return this.iconOnly && this._variant ? this._variant : 'inherit';
  }),

  buttonClasses: computed('variant', 'size', 'active', 'disabled', 'iconOnly', function() {
    if (this.iconOnly) {
      return this._iconOnlyClasses();
    }

    let variantClasses;

    switch (this.variant) {
      case 'primary':
        variantClasses = `bg-red-800 text-white ${this.disabled ? '' : 'hover:bg-red-900'}`;
        break;

      case 'plain':
        variantClasses = `bg-transparent border border-gray-300 ${
          this.disabled ? '' : 'hover:bg-gray-300 hover:border-transparent'
        }`;
        break;

      case 'secondary':
      default:
        variantClasses = `bg-gray-800 text-white ${this.disabled ? '' : 'hover:bg-gray-900'}`;
        break;
    }

    let sizeClasses;

    switch (this.size) {
      case 'large':
        sizeClasses = 'px-6 py-3 uppercase tracking-wider font-bold sm:text-xl';
        break;

      case 'medium':
      default:
        sizeClasses = 'px-4 py-2 font-semibold text-sm';
        break;
    }

    return `inline-block whitespace-no-wrap ${variantClasses} ${sizeClasses} ${this.disabled ? 'opacity-50 cursor-not-allowed' : ''} transition-form-element focus:outline-none focus:shadow-outline`;
  }),

  actions: {
    click(event) {
      if (this.task) {
        event.preventDefault();
        this.task.perform();
      } else if (this.onClick) {
        event.preventDefault();
        this.onClick();
      }
    },
  },
});
