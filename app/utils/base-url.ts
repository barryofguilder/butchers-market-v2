import { API_NAMESPACE, API_URL } from './config';

let baseUrl = API_URL;
if (baseUrl.endsWith('/') === false) {
  baseUrl += '/';
}
baseUrl += API_NAMESPACE;

export default baseUrl;
