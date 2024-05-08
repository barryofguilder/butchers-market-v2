import Component from '@glimmer/component';
import config from 'butchers-market/config/environment';
import UiButton from '../ui-button';

export default class MainNavOrderButtonComponent extends Component {
  orderOnlineUrl = config.orderOnlineUrl;

  <template>
    <UiButton @variant='primary' @size='medium' @href={{this.orderOnlineUrl}}>
      Order Online
    </UiButton>
  </template>
}
