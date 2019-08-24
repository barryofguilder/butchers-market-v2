import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  supportsDataTestProperties: true,

  'data-test-id': 'button',
  variant: 'secondary',
  size: 'large',
  disabled: false,
  href: null,
  task: null,
  onClick: null,

  buttonClasses: computed('variant', 'size', 'active', function() {
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
