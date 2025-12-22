import type { TOC } from '@ember/component/template-only';
import Container from './main-nav/container';
import OrderButton from './main-nav/order-button';
import { SHOW_ORDER_ONLINE } from '../utils/config';

const MobileOrderBannerComponent: TOC<{
  Element: null;
}> = <template>
  {{#if SHOW_ORDER_ONLINE}}
    <div class='bg-gray-400 py-3 lg:hidden'>
      <Container class='text-right'>
        <OrderButton />
      </Container>
    </div>
  {{/if}}
</template>;

export default MobileOrderBannerComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    MobileOrderBanner: typeof MobileOrderBannerComponent;
  }
}
