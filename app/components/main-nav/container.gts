import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';

const Container: TOC<{
  Element: HTMLDivElement;
  Args: EmptyObject;
  Blocks: {
    default: [];
  };
}> = <template>
  <div class='container px-4 sm:px-10' ...attributes>
    {{yield}}
  </div>
</template>;

export default Container;
