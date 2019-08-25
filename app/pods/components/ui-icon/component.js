import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  icon: null,
  iconPrefix: 'fas',
  variant: 'inherit',
  size: null,
  spin: false,

  color: computed('variant', 'disabled', function() {
    if (this.disabled) {
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
  }),
});
