import Component from '@glimmer/component';
import config from 'butchers-market/config/environment';
import UiButton from './ui-button';

export default class OrderButtonComponent extends Component<{ Element: HTMLDivElement }> {
  orderOnlineUrl = config.orderOnlineUrl;

  <template>
    <div ...attributes>
      <UiButton @variant='primary' @size='medium' @href={{this.orderOnlineUrl}}>
        Order Now
      </UiButton>

      <span class='ml-2 text-xs text-gray-700 italic'>* for pickup</span>
    </div>
  </template>
}
