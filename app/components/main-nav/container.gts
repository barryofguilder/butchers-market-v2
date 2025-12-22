import type { TOC } from '@ember/component/template-only';

const Container: TOC<{
  Element: HTMLDivElement;
  Blocks: {
    default: [];
  };
}> = <template>
  <div class='container px-4 sm:px-10' ...attributes>
    {{yield}}
  </div>
</template>;

export default Container;
