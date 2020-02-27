import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(object, request) {
    let json = ApplicationSerializer.prototype.serialize.apply(this, arguments);

    if (this._isDataCollection(json)) {
      json.meta = this._createPageMeta(json.data, request);
      json.data = this._paginateModel(json.data, request);
    }

    return json;
  },
});
