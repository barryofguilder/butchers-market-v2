import type { TOC } from '@ember/component/template-only';
import type { EmptyObject } from '@ember/component/helper';
// @ts-expect-error: We need to figure out how to create the types for this.
import sortBy from 'ember-composable-helpers/helpers/sort-by';
import GrabAndGoModel from '../models/grab-and-go';

export interface GrabAndGoListSignature {
  Element: HTMLDivElement;
  Args: {
    items: GrabAndGoModel[];
  };
  Blocks: EmptyObject;
}

const GrabAndGoListComponent: TOC<GrabAndGoListSignature> = <template>
  <div class='flex flex-wrap -mx-4' ...attributes>
    {{#each (sortBy 'title' @items) as |item|}}
      <div class='mt-10 px-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
        <div class='relative'>
          {{#if item.isSoldOut}}
            <div
              class='absolute px-4 py-2 whitespace-nowrap bg-red-700 text-white text-3xl font-semibold uppercase -rotate-12 xl:px-6 xl:text-4xl'
            >
              Sold Out
            </div>
          {{/if}}
          <img
            class='w-full shadow-md object-cover sm:w-[264px] sm:h-[202px] md:w-[208px] md:h-[159px] lg:w-[212px] lg:h-[162px] xl:w-[276px] xl:h-[211px] 2xl:w-[340px] 2xl:h-[260px]'
            src={{item.imageUrlPath}}
            alt={{item.title}}
          />
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
