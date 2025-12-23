import type { TOC } from '@ember/component/template-only';

const Subtitle: TOC<{
  Element: HTMLParagraphElement;
  Blocks: {
    default: [];
  };
}> = <template>
  <p class='mt-4 text-2xl md:text-3xl'>
    {{yield}}
  </p>
</template>;

export default Subtitle;
