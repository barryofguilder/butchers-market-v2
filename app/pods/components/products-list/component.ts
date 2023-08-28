import Component from '@glimmer/component';
import { EmptyObject } from '@ember/component/helper';
import config from 'butchers-market/config/environment';

export interface ProductsListSignature {
  Args: EmptyObject;
}

export default class ProductsListComponent extends Component<ProductsListSignature> {
  get showOrderOnline() {
    return config.showOrderOnline === true;
  }
}
