import type { TOC } from '@ember/component/template-only';
import sortBy from '../helpers/sort-by';
import GrabAndGoModel from '../models/grab-and-go';

export interface GrabAndGoListSignature {
  Element: HTMLDivElement;
  Args: {
    items: GrabAndGoModel[];
  };
}

const GrabAndGoListComponent: TOC<GrabAndGoListSignature> = <template>
  <div class='flex flex-wrap -mx-4' ...attributes>
    {{#each (sortBy 'title' @items) as |item|}}
      <div class='mt-10 px-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
        <div class='relative'>
          {{#unless item.inStock}}
            <div
              class='absolute px-4 py-2 whitespace-nowrap bg-red-800 text-white text-3xl font-semibold uppercase -rotate-12 xl:px-6 xl:text-4xl'
            >
              Sold Out
            </div>
          {{/unless}}

          {{#let
            'w-full shadow-md sm:w-[264px] sm:h-[202px] md:w-[208px] md:h-[159px] lg:w-[212px] lg:h-[162px] xl:w-[276px] xl:h-[211px] 2xl:w-[340px] 2xl:h-[260px]'
            as |classes|
          }}
            {{#if item.imageUrlPath}}
              <img class='object-cover {{classes}}' src={{item.imageUrlPath}} alt={{item.title}} />
            {{else}}
              <div
                class='hidden sm:flex sm:items-center sm:justify-center sm:bg-gray-200 {{classes}}'
              >
                <span class='text-lg text-gray-700'>No Image</span>
              </div>
            {{/if}}
          {{/let}}
        </div>
        <h4 class='mt-2 text-xl font-bold text-center text-gray-900'>{{item.title}}</h4>
        <p class='mt-1 text-center text-gray-600'>{{item.description}}</p>
      </div>
    {{/each}}
  </div>
</template>;

export default GrabAndGoListComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    GrabAndGoList: typeof GrabAndGoListComponent;
  }
}
