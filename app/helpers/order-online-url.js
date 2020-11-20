import { helper } from '@ember/component/helper';
import config from 'butchers-market/config/environment';

export function orderOnlineUrl() {
  return config.orderOnlineUrl;
}

export default helper(orderOnlineUrl);
