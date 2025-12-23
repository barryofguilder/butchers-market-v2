import type { TOC } from '@ember/component/template-only';

const ModalBody: TOC<{
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}> = <template>
  <div data-test-id='modal-body' ...attributes>
    {{yield}}
  </div>
</template>;

export default ModalBody;
