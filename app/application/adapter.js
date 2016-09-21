import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  namespace: 'data',
  
  urlForFindAll(modelName) {
    let url = this._super(...arguments);
    return url += '.json';
  }
});
