import ModalDialog from 'ember-modal-dialog/components/modal-dialog';

export default ModalDialog.extend({
  translucentOverlay: true,
  targetAttachment: 'none',

  overlayClassNamesString: 'modal-backdrop',
  containerClassNamesString: 'modal-content'
});
