import Component from '@glimmer/component';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import { restartableTask } from 'ember-concurrency';
import config from 'butchers-market/config/environment';
import type Features from '../../services/features';
import type Menu from '../../models/menu';
import OrderButton from './order-button';

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
  @service declare features: Features;
  @service declare store: Store;

  get showOrderOnline() {
    return config.showOrderOnline === true;
  }

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

  get showGrabAndGo() {
    return this.features.isEnabled('grab-and-go-menu');
  }

  constructor(owner: unknown, args: MainNavItemsSignature['Args']) {
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
      {{#if this.showOrderOnline}}
        <li class='hidden lg:block'>
          <OrderButton />
        </li>
      {{/if}}
      <li class='lg:ml-8 lg:block lg:h-full'>
        <LinkTo
          @route='meat'
          class='block px-6 py-4 lg:flex lg:items-center lg:py-0 lg:h-full hover:text-red-600 text-center lg:text-left'
          {{on 'click' this.itemClicked}}
        >
          Meat
        </LinkTo>
      </li>
      <li class='lg:block lg:h-full'>
        <LinkTo
          @route='deli'
          class='block px-6 py-4 lg:flex lg:items-center lg:py-0 lg:h-full hover:text-red-600 text-center lg:text-left'
          {{on 'click' this.itemClicked}}
        >
          Deli
        </LinkTo>
      </li>
      {{#if this.showGrabAndGo}}
        <li class='lg:block lg:h-full'>
          <LinkTo
            @route='grab-and-go'
            class='block px-6 py-4 lg:flex lg:items-center lg:py-0 lg:h-full hover:text-red-600 text-center lg:text-left'
            {{on 'click' this.itemClicked}}
          >
            Grab &amp; Go
          </LinkTo>
        </li>
      {{/if}}
      <li class='lg:block lg:h-full'>
        <a
          href={{this.menuUrl}}
          class='block px-6 py-4 lg:flex lg:items-center lg:py-0 lg:h-full hover:text-red-600 text-center lg:text-left'
        >
          Cafe Menu
        </a>
      </li>
    </ul>
  </template>
}
