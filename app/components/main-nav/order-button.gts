import Component from '@glimmer/component';
import config from 'butchers-market/config/environment';
// TODO: Fix this.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Button from '../button';

export default class MainNavOrderButtonComponent extends Component {
  orderOnlineUrl = config.orderOnlineUrl;

  <template>
    <Button @variant='primary' @size='medium' @href={{this.orderOnlineUrl}}>
      Order Online
    </Button>
  </template>
}
