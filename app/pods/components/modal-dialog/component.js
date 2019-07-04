import ModalDialog from 'ember-modal-dialog/components/modal-dialog';
import { computed } from '@ember/object';

export default ModalDialog.extend({
  size: null,

  translucentOverlay: true,
  targetAttachment: 'none',

  overlayClassNamesString: 'modal-backdrop',
  containerClassNamesString: 'modal',

  sizeClass: computed('size', function() {
    if (this.size === 'large') {
      return 'modal-lg';
    }

    if (this.size === 'small') {
      return 'modal-sm';
    }

    return '';
  }),
});
