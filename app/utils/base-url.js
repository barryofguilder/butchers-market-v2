import config from 'butchers-market/config/environment';

let baseUrl = config.api;
if (baseUrl.endsWith('/') === false) {
  baseUrl += '/';
}
baseUrl += config.namespace;

export default baseUrl;
