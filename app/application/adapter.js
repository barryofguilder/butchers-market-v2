import DS from 'ember-data';
import config from 'butchers-market/config/environment';

export default DS.RESTAdapter.extend({
  host: config.api,
  namespace: 'data',

  urlForFindAll(/* modelName */) {
    let url = this._super(...arguments);
    return url += '.json';
  }
});
