import type { TOC } from '@ember/component/template-only';
import { hash } from '@ember/helper';
import { waitForPromise } from '@ember/test-waiters';
// @ts-expect-error: There are no types for this.
import { focusTrap } from 'ember-focus-trap';
import { Modal } from 'ember-primitives';
import ModalHeader from './modal-dialog/header';
import ModalBody from './modal-dialog/body';
import ModalFooter from './modal-dialog/footer';

export interface ModalDialogSignature {
  Element: HTMLDivElement;
  Args: {
    isOpen: boolean;
    onClose: () => void;
  };
  Blocks: {
    default: [
      {
        header: typeof ModalHeader;
        body: typeof ModalBody;
        footer: typeof ModalFooter;
      },
    ];
  };
}

const ModalDialogComponent: TOC<ModalDialogSignature> = <template>
  <Modal @onClose={{@onClose}} as |m|>
    {{sideEffect toggle @isOpen m}}

    <m.Dialog
      class='fixed max-w-full max-h-full min-h-full m-0 inset-0 z-50 w-full overflow-y-auto bg-transparent'
      {{focusTrap isActive=m.isOpen}}
    >
      <div class='animate-modal-overlay-show fixed inset-0 bg-gray-500/75'></div>
      <div
        class='flex fixed inset-0 items-end justify-center px-4 pt-4 pb-12 text-center sm:block sm:p-0'
      >
        <div
          class='animate-modal-dialog-show inline-block w-full px-4 pt-5 pb-4 overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl sm:my-12 sm:align-middle sm:max-w-sm sm:p-6'
        >
          {{yield (hash header=ModalHeader body=ModalBody footer=ModalFooter)}}
        </div>
      </div>
    </m.Dialog>
  </Modal>
</template>;

export default ModalDialogComponent;

function toggle(
  wantsOpen: boolean,
  { open, close, isOpen }: { open: () => void; close: () => void; isOpen: boolean }
) {
  if (wantsOpen) {
    if (isOpen) return;
    open();
    return;
  }

  if (!isOpen) {
    return;
  }

  close();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sideEffect<T extends (...args: any[]) => void>(func: T, ...args: Parameters<T>): void {
  waitForPromise(
    (async () => {
      // auto tracking is synchronous.
      // This detaches from tracking frames.
      await Promise.resolve();
      func(...args);
    })()
  );
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ModalDialog: typeof ModalDialogComponent;
  }
}
