import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';
import type Special from '../../models/special';

const SpecialListItem: TOC<{
  Element: HTMLDivElement;
  Args: {
    special: Special;
  };
  Blocks: EmptyObject;
}> = <template>
  <div class='mt-10'>
    <a href={{@special.renderLink}} class='block relative'>
      {{#unless @special.inStock}}
        <div
          class='absolute px-4 py-2 whitespace-nowrap bg-red-700 text-white text-3xl font-semibold uppercase -rotate-12 xl:px-8 xl:text-5xl'
        >
          Sold Out
        </div>
      {{/unless}}
      <img src={{@special.imageUrlPath}} alt={{@special.imageAltText}} class='w-full' />
    </a>
  </div>
</template>;

export default SpecialListItem;
