import type { TOC } from '@ember/component/template-only';

const Required: TOC<{
  Element: HTMLSpanElement;
}> = <template>
  <span class='text-red-700'>*</span>
</template>;

export default Required;
