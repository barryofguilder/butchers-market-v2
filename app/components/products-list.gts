import Component from '@glimmer/component';
import config from 'butchers-market/config/environment';
// @ts-expect-error - there are no types for this
import sortBy from '../helpers/sort-by';
import { and } from 'ember-truth-helpers';
import MeatBundle from '../models/meat-bundle';
import OrderButton from './order-button';

interface ProductsListSignature {
  Args: {
    products: MeatBundle[];
  };
  Blocks: {
    default: [];
  };
}

export default class ProductsListComponent extends Component<ProductsListSignature> {
  get showOrderOnline() {
    return config.showOrderOnline === true;
  }

  <template>
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

          {{#if (and product.orderEnabled this.showOrderOnline)}}
            <OrderButton class='mt-4' />
          {{/if}}
        </div>
      {{/each}}

      {{yield}}
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ProductsList: typeof ProductsListComponent;
  }
}
