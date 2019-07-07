import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  variant: 'secondary',
  href: null,
  task: null,
  onClick: null,

  buttonClasses: computed('variant', function() {
    let variantClasses;

    switch (this.variant) {
      case 'primary':
        variantClasses = 'bg-red-800 hover:bg-red-900 text-white';
        break;

      case 'secondary':
      default:
        variantClasses = 'bg-gray-800 hover:bg-gray-900 text-white';
        break;
    }

    return `inline-block px-6 py-3 whitespace-no-wrap uppercase tracking-wider font-bold ${variantClasses} sm:text-xl`;
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
