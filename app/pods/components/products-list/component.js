import Component from '@glimmer/component';
import config from 'butchers-market/config/environment';

export default class ProductsListComponent extends Component {
  get showOrderOnline() {
    return config.showOrderOnline === true;
  }
}
