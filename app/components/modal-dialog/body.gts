import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';

const ModalBody: TOC<{
  Element: HTMLDivElement;
  Args: EmptyObject;
  Blocks: {
    default: [];
  };
}> = <template>
  <div data-test-id='modal-body' ...attributes>
    {{yield}}
  </div>
</template>;

export default ModalBody;
