import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import { computed } from '@ember/object';

export default ModalDialog.extend({
  size: null,

  translucentOverlay: false,
  targetAttachment: 'none',

  didInsertElement() {
    this._super(...arguments);

    document.body.classList.add('overflow-y-hidden');
  },

  willDestroyElement() {
    this._super(...arguments);

    document.body.classList.remove('overflow-y-hidden');
  },

  wrapperClasses: 'fixed z-50 inset-0 overflow-auto bg-overlay flex',
  overlayClasses: computed('sizeClass', function () {
    return `relative shadow-overlay mx-6 mt-6 mb-auto p-6 bg-white rounded ${this.sizeClass} focus:outline-none focus:shadow-outline sm:mt-16 sm:mx-auto`;
  }),

  sizeClass: computed('size', function () {
    switch (this.size) {
      case 'small':
        return 'max-w-xl';

      case 'large':
        return 'max-w-5xl';

      case 'medium':
      default:
        return 'max-w-3xl';
    }
  }),
});
