import type { TOC } from '@ember/component/template-only';
// @ts-expect-error - there are no types for this
import sortBy from '../helpers/sort-by';
import { and } from 'ember-truth-helpers';
import MeatBundle from '../models/meat-bundle';
import OrderButton from './order-button';
import { SHOW_ORDER_ONLINE } from '../utils/config';

interface ProductsListSignature {
  Args: {
    products: MeatBundle[];
  };
  Blocks: {
    default: [];
  };
}

const ProductsListComponent: TOC<ProductsListSignature> = <template>
  <div class='flex flex-wrap -mx-4'>
    {{#each (sortBy 'displayOrder' @products) as |product|}}
      <div class='mt-12 px-4 w-full sm:w-1/2 lg:w-1/3'>
        <h5 class='text-red-700 text-xl sm:text-2xl font-black uppercase tracking-wide'>
          {{product.title}}
          <span>$<span>{{product.price}}</span></span>
        </h5>
        <ul class='pl-8 list-disc sm:text-lg'>
          {{#if product.specialText}}
            <li class='text-red-700 italic font-semibold'>
              {{product.specialText}}
            </li>
          {{/if}}
          {{#each product.items as |item|}}
            <li>{{item}}</li>
          {{/each}}
        </ul>

        {{#if (and product.orderEnabled SHOW_ORDER_ONLINE)}}
          <OrderButton class='mt-4' />
        {{/if}}
      </div>
    {{/each}}

    {{yield}}
  </div>
</template>;

export default ProductsListComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ProductsList: typeof ProductsListComponent;
  }
}
