import type { TOC } from '@ember/component/template-only';

const Title: TOC<{
  Element: HTMLUListElement;
  Args: {
    title?: string;
  };
  Blocks: {
    default: [];
  };
}> = <template>
  <h1 class='mb-8 text-xl md:text-3xl uppercase font-black'>
    {{#if (has-block)}}
      {{yield}}
    {{else}}
      {{@title}}
    {{/if}}
  </h1>
</template>;

export default Title;
