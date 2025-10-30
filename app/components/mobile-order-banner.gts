import Component from '@glimmer/component';
import config from 'butchers-market/config/environment';
import Container from './main-nav/container';
import OrderButton from './main-nav/order-button';

export default class MobileOrderBannerComponent extends Component {
  get showOrderOnline() {
    return config.showOrderOnline === true;
  }

  <template>
    {{#if this.showOrderOnline}}
      <div class='bg-gray-400 py-3 lg:hidden'>
        <Container class='text-right'>
          <OrderButton />
        </Container>
      </div>
    {{/if}}
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    MobileOrderBanner: typeof MobileOrderBannerComponent;
  }
}
