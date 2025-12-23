import type { TOC } from '@ember/component/template-only';

const ModalHeader: TOC<{
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}> = <template>
  <div data-test-id='modal-header' class='mb-4 flex justify-between' ...attributes>
    <h4 data-test-id='modal-title' class='font-semibold text-2xl'>
      {{yield}}
    </h4>
  </div>
</template>;

export default ModalHeader;
