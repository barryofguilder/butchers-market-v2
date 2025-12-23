import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { API_NAMESPACE, API_URL } from '../../utils/config';

export default class DefaultAdapter extends JSONAPIAdapter {
  host = API_URL;
  namespace = API_NAMESPACE;
}
