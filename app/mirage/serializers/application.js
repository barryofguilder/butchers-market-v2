import { JSONAPISerializer } from 'miragejs';
import { camelize } from '@ember/string';

export default JSONAPISerializer.extend({
  keyForAttribute(attr /*, method*/) {
    return camelize(attr);
  },

  // Determines whether the data is an array.
  _isDataCollection(json) {
    return json.data && Array.isArray(json.data);
  },
});
