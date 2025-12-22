import type { TOC } from '@ember/component/template-only';

const ModalFooter: TOC<{
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}> = <template>
  <div data-test-id='modal-footer' class='mt-6 flex justify-end' ...attributes>
    {{yield}}
  </div>
</template>;

export default ModalFooter;
