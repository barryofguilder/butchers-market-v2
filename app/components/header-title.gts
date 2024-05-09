import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';

const HeaderTitle: TOC<{
  Element: HTMLElement;
  Args: {
    title: string;
  };
  Blocks: EmptyObject;
}> = <template>
  <header class='mt-16 sm:flex sm:items-center sm:flex-row'>
    <div
      class='hidden sm:block sm:flex-auto sm:border-red-700 sm:border-2'
      aria-hidden='true'
    ></div>
    <h2
      class='mx-6 my-2 text-center uppercase tracking-wide font-black text-2xl sm:text-4xl sm:shrink'
    >
      {{@title}}
    </h2>
    <div
      class='hidden sm:block sm:flex-auto sm:border-red-700 sm:border-2'
      aria-hidden='true'
    ></div>
  </header>
</template>;

export default HeaderTitle;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    HeaderTitle: typeof HeaderTitle;
  }
}
