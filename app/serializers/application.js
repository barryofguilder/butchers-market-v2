import JSONAPISerializer from '@ember-data/serializer/json-api';
import { camelize } from '@ember/string';

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(attr /*, method*/) {
    return camelize(attr);
  }
}
