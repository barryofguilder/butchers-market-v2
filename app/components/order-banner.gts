import Component from '@glimmer/component';
import { service } from '@ember/service';
import { and } from 'ember-truth-helpers';
import config from 'butchers-market/config/environment';
import Container from './main-nav/container';
import OrderButton from './main-nav/order-button';

export default class OrderBannerComponent extends Component {
  // TODO: Fix this type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @service declare media: any;

  get isMobile() {
    return !this.media.isLg && !this.media.isXl;
  }

  get showOrderOnline() {
    return config.showOrderOnline === true;
  }

  <template>
    {{#if (and this.isMobile this.showOrderOnline)}}
      <div class='bg-gray-400 py-3'>
        <Container class='text-right'>
          <OrderButton />
        </Container>
      </div>
    {{/if}}
  </template>
}
