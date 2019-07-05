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
        variantClasses = 'bg-gray-700 hover:bg-gray-900 text-white';
        break;
    }

    return `inline-block px-6 py-3 whitespace-no-wrap uppercase tracking-wider text-xl font-bold ${variantClasses}`;
  }),

  actions: {
    click(event) {
      event.preventDefault();

      if (this.task) {
        this.task.perform();
      } else if (this.onClick) {
        this.onClick();
      }
    },
  },
});
