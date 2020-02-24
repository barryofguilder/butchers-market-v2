import JSONAPIAdapter from '@ember-data/adapter/json-api';
import config from 'butchers-market/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = config.api;
  namespace = config.namespace;
}
