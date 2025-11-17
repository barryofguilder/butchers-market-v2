import Component from '@glimmer/component';
import type { EmptyObject } from '@ember/component/helper';
import { format } from 'date-fns';
import type GrabAndGo from '../../../models/grab-and-go';
import UiCopyButton from '../../ui-copy-button';
import { tracked } from '@glimmer/tracking';

interface SocialListSignature {
  Element: HTMLLIElement;
  Args: {
    items: GrabAndGo[];
  };
  Blocks: EmptyObject;
}

export default class SocialListComponent extends Component<SocialListSignature> {
  get date() {
    return format(new Date(), 'M/dd/yyyy');
  }

  get copyText() {
    const items = this.args.items
      .map((item) => (item.socialTitle ? item.socialTitle : item.title))
      .join('\n');

    return `Grab & Go Inventory for: ${this.date}\n\n${items}`;
  }

  <template>
    <div class='flex flex-col gap-6'>
      <p>
        This contains all the Grab and Go items that are currently in stock and has the social title
        for you to copy and paste to your social media accounts.
      </p>

      <div>
        <UiCopyButton @text={{this.copyText}} />
      </div>

      <div>
        {{! This needs to be all in one line so that copying works correctly }}
        <p class='text-lg'>Grab &amp; Go Inventory for:
          {{this.date}}<br /><br />{{#each @items as |item|}}{{if
              item.socialTitle
              item.socialTitle
              item.title
            }}<br />{{else}}<span class='text-gray-500 italic'>No in stock Grab and Go items</span>{{/each}}</p>
      </div>
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Admin::GrabAndGo::SocialList': typeof SocialListComponent;
  }
}
