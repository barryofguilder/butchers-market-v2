import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';

const Subtitle: TOC<{
  Element: HTMLParagraphElement;
  Args: EmptyObject;
  Blocks: {
    default: [];
  };
}> = <template>
  <p class='mt-4 text-2xl md:text-3xl'>
    {{yield}}
  </p>
</template>;

export default Subtitle;
