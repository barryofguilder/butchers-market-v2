import type { TOC } from '@ember/component/template-only';

const Container: TOC<{
  Element: HTMLDivElement;
  Args: {
    fullWidth?: boolean;
  };
  Blocks: {
    default: [];
  };
}> = <template>
  <div class='container {{if @fullWidth "" "px-10"}}' ...attributes>
    {{yield}}
  </div>
</template>;

export default Container;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Container: typeof Container;
  }
}
