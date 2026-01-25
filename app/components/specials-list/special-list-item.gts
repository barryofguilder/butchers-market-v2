import type { TOC } from '@ember/component/template-only';
import type Special from '../../models/special';

const SpecialListItem: TOC<{
  Element: HTMLDivElement;
  Args: {
    special: Special;
  };
}> = <template>
  <div class='mt-10 text-center'>
    <a
      href={{@special.renderLink}}
      class='block relative focus:outline-hidden focus:ring-3 focus:ring-red-800'
    >
      {{#unless @special.inStock}}
        <div
          class='absolute px-4 py-2 whitespace-nowrap bg-red-700 text-white text-3xl font-semibold uppercase -rotate-12 xl:px-8 xl:text-5xl'
        >
          Sold Out
        </div>
      {{/unless}}
      <img src={{@special.imageUrlPath}} alt={{@special.imageAltText}} class='w-full' />
    </a>

    <a
      href={{@special.renderLink}}
      class='text-red-800 hover:underline focus:outline-hidden focus:underline'
    >
      Click for Details
    </a>
  </div>
</template>;

export default SpecialListItem;
