import type { TOC } from '@ember/component/template-only';
import UiButton from './ui-button';
import { ORDER_ONLINE_URL } from '../utils/config';

const OrderButtonComponent: TOC<{ Element: HTMLDivElement }> = <template>
  <div ...attributes>
    <UiButton @variant='primary' @size='medium' @href={{ORDER_ONLINE_URL}}>
      Order Now
    </UiButton>

    <span class='ml-2 text-xs text-gray-700 italic'>* for pickup</span>
  </div>
</template>;

export default OrderButtonComponent;
