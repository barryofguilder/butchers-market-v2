import Component from '@glimmer/component';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import { lastValue, restartableTask } from 'ember-concurrency';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import type Features from '../../services/features';
import OrderButton from './order-button';
import config from 'butchers-market/config/environment';
import type Menu from '../../models/menu';
import { action } from '@ember/object';

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
  // TODO: Fix this type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare media: any;
  @service declare store: Store;

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }

  get showOrderOnline() {
    return config.showOrderOnline === true;
  }

  @lastValue('loadMenu')
  menus: Menu[] | null = null;

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
      {{#unless this.isMobile}}
        {{#if this.showOrderOnline}}
          <li>
            <OrderButton />
          </li>
        {{/if}}
      {{/unless}}
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
      {{!-- Drew doesn't want the contact form anymore. Commenting this out instead of deleting in
            case he changes his mind. }}
      {{!-- <li class='lg:block lg:h-full'>
        <LinkTo
          @route='contact'
          class='block px-6 py-4 lg:flex lg:items-center lg:py-0 lg:h-full hover:text-red-600 text-center lg:text-left'
          {{on 'click' this.itemClicked}}
        >
          Contact
        </LinkTo>
      </li> --}}
    </ul>
  </template>
}
