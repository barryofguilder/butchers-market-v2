import Component from '@glimmer/component';
import config from 'butchers-market/config/environment';

export default class OrderButton extends Component {
  get orderOnlineUrl() {
    return config.orderOnlineUrl;
  }
}
