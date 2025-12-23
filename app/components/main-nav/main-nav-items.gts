import Component from '@glimmer/component';
import { service } from '@ember/service';
import type Owner from '@ember/owner';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import { restartableTask } from 'ember-concurrency';
import type Menu from '../../models/menu';
import OrderButton from './order-button';
import { SHOW_ORDER_ONLINE } from '../../utils/config';

export interface MainNavItemsSignature {
  Element: HTMLElement;
  Args: {
    itemClicked: (event: MouseEvent) => void;
  };
  Blocks: {
    default: [];
  };
}

export default class MainNavItemsComponent extends Component<MainNavItemsSignature> {
  @service declare store: Store;

  get menus() {
    const menus = this.loadMenu.lastSuccessful?.value;

    if (menus) {
      return menus.slice() as Menu[];
    }

    return null;
  }

  get menuUrl() {
    if (this.menus?.[0]) {
      return this.menus[0].fileUrlPath;
    }

    return null;
  }

  constructor(owner: Owner, args: MainNavItemsSignature['Args']) {
    super(owner, args);

    this.loadMenu.perform();
  }

  loadMenu = restartableTask(async () => {
    return await this.store.findAll('menu');
  });

  @action itemClicked(event: MouseEvent) {
    this.args.itemClicked?.(event);
  }

  <template>
    <ul class='list-reset flex flex-col lg:flex-row lg:items-center'>
      {{#let
        'block px-6 py-4 lg:flex lg:items-center lg:py-0 lg:h-full hover:text-red-600 focus:text-red-600 focus:outline-hidden text-center lg:text-left'
        as |classes|
      }}
        {{#if SHOW_ORDER_ONLINE}}
          <li class='hidden lg:block'>
            <OrderButton />
          </li>
        {{/if}}
        <li class='lg:ml-8 lg:block lg:h-full'>
          <LinkTo @route='meat' class={{classes}} {{on 'click' this.itemClicked}}>
            Meat
          </LinkTo>
        </li>
        <li class='lg:block lg:h-full'>
          <LinkTo @route='deli' class={{classes}} {{on 'click' this.itemClicked}}>
            Deli
          </LinkTo>
        </li>
        <li class='lg:block lg:h-full'>
          <LinkTo @route='grab-and-go' class={{classes}} {{on 'click' this.itemClicked}}>
            Grab &amp; Go
          </LinkTo>
        </li>
        <li class='lg:block lg:h-full'>
          <a href={{this.menuUrl}} class={{classes}}>
            Cafe Menu
          </a>
        </li>
      {{/let}}
    </ul>
  </template>
}
