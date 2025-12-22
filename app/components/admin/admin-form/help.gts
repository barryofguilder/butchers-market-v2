import type { TOC } from '@ember/component/template-only';

const Help: TOC<{
  Element: HTMLSpanElement;
  Blocks: {
    default: [];
  };
}> = <template>
  <span data-test-id='help' class='my-1 text-sm text-gray-700 block' ...attributes>
    {{yield}}
  </span>
</template>;

export default Help;
