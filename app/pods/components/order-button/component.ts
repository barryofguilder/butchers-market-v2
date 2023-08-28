import Component from '@glimmer/component';
import { EmptyObject } from '@ember/component/helper';
import config from 'butchers-market/config/environment';

export interface OrderButtonSignature {
  Args: EmptyObject;
}

export default class OrderButtonComponent extends Component<OrderButtonSignature> {
  orderOnlineUrl = config.orderOnlineUrl;
}
