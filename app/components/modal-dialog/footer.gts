import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';

const ModalFooter: TOC<{
  Element: HTMLDivElement;
  Args: EmptyObject;
  Blocks: {
    default: [];
  };
}> = <template>
  <div data-test-id='modal-footer' class='mt-6 flex justify-end' ...attributes>
    {{yield}}
  </div>
</template>;

export default ModalFooter;
