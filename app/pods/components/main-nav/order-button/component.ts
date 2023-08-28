import Component from '@glimmer/component';
import { EmptyObject } from '@ember/component/helper';
import config from 'butchers-market/config/environment';

export interface MainNavOrderButtonSignature {
  Args: EmptyObject;
}

export default class MainNavOrderButtonComponent extends Component<MainNavOrderButtonSignature> {
  orderOnlineUrl = config.orderOnlineUrl;
}
