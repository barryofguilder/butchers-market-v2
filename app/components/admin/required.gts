import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';

const Required: TOC<{
  Element: HTMLSpanElement;
  Args: EmptyObject;
  Blocks: EmptyObject;
}> = <template>
  <span class='text-red-600'>*</span>
</template>;

export default Required;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Admin::Required': typeof Required;
  }
}
