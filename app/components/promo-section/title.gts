import type { TOC } from '@ember/component/template-only';

const Title: TOC<{
  Element: HTMLHeadingElement;
  Blocks: {
    default: [];
  };
}> = <template>
  <h1 class='font-black text-4xl leading-snug md:text-5xl md:leading-snug tracking-wide uppercase'>
    {{yield}}
  </h1>
</template>;

export default Title;
