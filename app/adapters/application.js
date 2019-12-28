import RESTAdapter from '@ember-data/adapter/rest';
import config from 'butchers-market/config/environment';

export default class ApplicationAdapter extends RESTAdapter {
  host = config.api;
  namespace = 'data';

  urlForFindAll(/* modelName */) {
    let url = super.urlForFindAll(...arguments);
    let timestamp = new Date().getTime();

    return `${url}.json?t=${timestamp}`;
  }
}
